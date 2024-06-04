import { uploadImageI } from "src/modules/book/interfaces/book.interface";
import { Body, Controller, Post, Req } from "@nestjs/common";
import { S3Service } from "src/common/services/s3.service";
import { ProjectPaths } from "src/common/constants/paths";
import { ImagesRepository } from "src/modules/project/repositories/image.repository";

@Controller("books/draft")
export class DraftController {
  constructor(
    private readonly imagesRepo: ImagesRepository,
    private readonly s3Service: S3Service
  ) {}
  async handleFetchPresignedForDraft(body: uploadImageI) {
    const img = await this.imagesRepo.getDraftImage({
      id: body.id,
    });
    const s3Path = img.Image.s3Path;
    const mimeType = img.Image.mimeType;
    const signedURL = await this.s3Service.getPresignedURL({
      path: s3Path,
      mimeType,
    });
    return { signedURL };
  }
  @Post("/presigned")
  async uploadBookDraft(
    @Body()
    body: uploadImageI,
    @Req()
    req: Request
  ) {
    const uploadedBy = req["context"]["userDetails"]?.id;
    const { title } = body;
    let { mimeType } = body;
    let s3Path: string = `${
      ProjectPaths.S3_BOOK_DRAFT
    }/${title}${new Date().valueOf()}`;
    if (body.id) {
      return this.handleFetchPresignedForDraft(body);
    }
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
    return { signedURL, id: doc.id };
  }
}
