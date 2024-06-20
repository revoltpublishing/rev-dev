import { Injectable } from "@nestjs/common";
import { S3Service } from "src/common/services/s3.service";
import { ImagesRepository } from "src/modules/project/repositories/image.repository";
import { uploadImageI } from "../interfaces/book.interface";
import axios from "axios";
import { convertToHtml } from "mammoth";
import { ConfigService } from "@nestjs/config";
import { DraftRepository } from "../repositories/draft.repository";
import { BOOK_STAGE_TREE } from "../constants/stage";
import { DbExecptions } from "src/common/constants/status";
import { Prisma } from "@prisma/client";
import { addBookDraftPageI } from "../interfaces/draft.interface";

@Injectable()
export class DraftService {
  constructor(
    private readonly imagesRepo: ImagesRepository,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
    private readonly draftRepo: DraftRepository
  ) {}
  async fetchPresignedForDraft(body: { bookId: string }) {
    const img = await this.imagesRepo.getDraftImage({
      id: body.bookId,
    });
    const s3Path = img.BookDraft.s3Path;
    const mimeType = img.BookDraft.mimeType;
    const signedURL = await this.s3Service.getPresignedURL({
      path: s3Path,
      mimeType,
    });
    return { signedURL };
  }
  async addBookDraftImage(body: uploadImageI) {
    const { s3Path, mimeType, title, uploadedBy } = body;
    const signedURL = await this.s3Service.getPresignedURLForUpload({
      path: s3Path,
      mimeType,
    });
    const doc = await this.imagesRepo.addImage({
      title,
      s3Path,
      mimeType,
      uploadedBy,
    });
    return { signedURL, doc };
  }
  async prepareDraft(body: {
    bookId: string;
    stageId: number;
    parentBkManuId?: string;
  }) {
    const { parentBkManuId, ...rest } = body;
    const bkStg = await this.draftRepo.getBookDetailsByStage(rest);
    const payload = {
      bkStgId: bkStg.id,
      name: "Orignal Manuscript",
      isSubmitted: true,
      parentId: body.parentBkManuId ? body.parentBkManuId : null,
    };
    if (!body.parentBkManuId) {
      const { signedURL } = await this.fetchPresignedForDraft({
        bookId: bkStg.Book.id,
      });
      const res = await axios.get(signedURL, {
        responseType: "arraybuffer",
      });
      const draftBuf = Buffer.from(res.data);
      const mapped = await convertToHtml(
        {
          buffer: draftBuf,
        },
        {
          ignoreEmptyParagraphs: false,
        }
      );
      const bkM = await this.draftRepo.addBookManuscript(payload);
      const pgs = this.splitIntoPages({
        html: mapped.value,
      });
      const mpedPgs = pgs.map((pg, i) => {
        const obj: addBookDraftPageI = {
          content: pg,
          page: i,
          bkStgManuId: bkM.id,
        };
        return obj;
      });
      await this.draftRepo.addBookStageManuscriptPages(mpedPgs);
      return bkM;
    }
    return await this.draftRepo.addBookManuscript(payload);
  }
  splitIntoPages(body: { html: string }): string[] {
    const { html } = body;
    const pageSize = this.configService.get("MAX_CHAR_PER_PAGE");
    const paragraphs = html.split("</p>");
    const pages = [];
    let currentPage = "";
    for (const paragraph of paragraphs) {
      if (currentPage.length + paragraph.length > pageSize) {
        pages.push(currentPage);
        currentPage = paragraph + "</p>";
      } else {
        currentPage += paragraph + "</p>";
      }
    }
    // Push the last page
    if (currentPage) {
      pages.push(currentPage);
    }
    return pages;
  }
  getBookStageId(params: { stage: string }) {
    const stgD = BOOK_STAGE_TREE.find((bk) => bk.stage === params.stage);
    if (!stgD) {
      throw DbExecptions.ROLE_DOESNOT_EXISTS;
    }
    return stgD;
  }
  // post api for bk mansc; if issubm then create new manu or else start editing in it.
  // get api for manusc by id
  // get api for bkid and stg with all manu attched nd
}
