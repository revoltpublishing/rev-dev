import {
  uploadImageI,
  uploadImageParamsI,
} from "src/modules/book/interfaces/book.interface";
import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { ProjectPaths } from "src/common/constants/paths";
import { ImageFormats } from "../constants/formats";
import { DynamicStatusCodes } from "src/common/constants/status";
import { DraftService } from "../services/draft.service";
import { DraftRepository } from "../repositories/draft.repository";

@Controller("books/draft")
export class DraftController {
  constructor(
    private readonly draftService: DraftService,
    private readonly draftRepo: DraftRepository
  ) {}
  @Post("/presigned")
  async uploadBookDraft(
    @Body()
    body: uploadImageI,
    @Req()
    req: Request
  ) {
    const uploadedBy = req["context"]["userDetails"]?.id;
    const { title } = body;
    const { mimeType } = body;
    if (!ImageFormats.DRAFT_ACCEPTED_FORMATS.includes(mimeType))
      throw DynamicStatusCodes.INVAID_DOCUMENT_FORMAT(
        ImageFormats.DRAFT_ACCEPTED_FORMATS.join(",")
      );
    let s3Path: string = `${
      ProjectPaths.S3_BOOK_DRAFT
    }/${title}${new Date().valueOf()}`;
    if (body.id) {
      return this.draftService.fetchPresignedForDraft({ bookId: body.id });
    }
    const { signedURL, doc } = await this.draftService.addBookDraftImage({
      ...body,
      s3Path,
      uploadedBy,
    });
    return { signedURL, id: doc.id };
  }
  @Get("/:id/prepare")
  async prepareDraft(
    @Param()
    params: uploadImageParamsI
  ) {
    return await this.draftService.prepareDraft({ bookId: params.id });
  }
  @Get("/:id/pages/:pageNo")
  async getDraftCharacterByPage(
    @Param() params: { id: string; pageNo: number }
  ) {
    return this.draftRepo.getDraftCharactersByPage({
      bookId: params.id,
      pageNo: Number(params.pageNo),
    });
  }
}
