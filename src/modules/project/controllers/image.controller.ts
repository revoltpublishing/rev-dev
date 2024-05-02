import { uploadBookDraftI } from "src/modules/book/interfaces/book.interface";
import { ImageService } from "../services/image.service";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { S3Service } from "src/common/services/s3.service";

@Controller("image")
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
    const { name, mimeType, uploadedByUserId } = body;
    const s3Path = `drafts/${name}`;
    const signedURL = await this.s3Service.getPresignedURL({
      path: s3Path,
      mimeType,
    });
    const doc = await this.imageService.addBookDraftImage({
      name,
      s3Path,
      mimeType,
      uploadedByUserId,
    });
    return { signedURL, id: doc.id };
  }
}
