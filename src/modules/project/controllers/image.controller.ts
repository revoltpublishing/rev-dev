import { uploadBookDraftI } from "src/modules/book/interfaces/book.interface";
import { ImageService } from "../services/image.service";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { S3Service } from "src/common/services/s3.service";

@Controller("images")
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly s3Service: S3Service
  ) {}
  @Post("/draft/presigned")
  async uploadBookDraft(
    @Body()
    body: uploadBookDraftI
  ) {
    const { title, mimeType, uploadedBy } = body;
    const s3Path = `drafts/${title}`;
    const signedURL = await this.s3Service.getPresignedURL({
      path: s3Path,
      mimeType,
    });
    const doc = await this.imageService.addBookDraftImage({
      title,
      s3Path,
      mimeType,
      uploadedBy,
    });
    return { signedURL, id: doc.id };
  }
}
