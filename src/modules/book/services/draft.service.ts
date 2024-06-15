import { Injectable } from "@nestjs/common";
import { S3Service } from "src/common/services/s3.service";
import { ImagesRepository } from "src/modules/project/repositories/image.repository";
import { uploadImageI } from "../interfaces/book.interface";
import axios from "axios";
import { convertToHtml } from "mammoth";
import * as uuid from "uuid";
import { ConfigService } from "@nestjs/config";
import { DraftRepository } from "../repositories/draft.repository";

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
    if (!img) return;
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
  async prepareDraft(body: { bookId: string }) {
    const { signedURL } = await this.fetchPresignedForDraft(body);
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
    // return Promise.all([
    await this.splitIntoPages({
      html: mapped.value,
      bookId: body.bookId,
    });
    return await this.draftRepo.getDraftCharactersByPage({
      bookId: body.bookId,
      pageNo: 1,
    });
    // ]);
  }
  async splitIntoPages(body: { html: string; bookId: string }) {
    const { html, bookId } = body;
    const pageSize = this.configService.get("MAX_CHAR_PER_PAGE");
    const paragraphs = html.split("</p>");
    const pages = [];
    let currentPage = "";
    let prevId = "";

    for (const paragraph of paragraphs) {
      if (currentPage.length + paragraph.length > pageSize) {
        pages.push(currentPage);
        currentPage = paragraph + "</p>";
      } else {
        currentPage += paragraph + "</p>";
      }
      const bkCh = await this.draftRepo.addDraftPageCharacter({
        bookId,
        pageNo: pages.length + 1,
        char: paragraph + "</p>",
        prevId: prevId.length > 0 ? prevId : undefined,
      });
      prevId = bkCh.id; // No need to use repeat(1) as it does nothing here
    }
    // Push the last page
    if (currentPage) {
      pages.push(currentPage);
    }
    return pages;
  }
}
