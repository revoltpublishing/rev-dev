import { uploadImageI } from "src/modules/book/interfaces/book.interface";
import { ImageService } from "../services/image.service";
import { Body, Controller, Post } from "@nestjs/common";
import { S3Service } from "src/common/services/s3.service";
import { ProjectPaths } from "src/common/constants/paths";

@Controller("image")
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly s3Service: S3Service
  ) {}

  async handleFetchPresignedForDraft(body: uploadImageI) {
    const img = await this.imageService.getDraftImage({
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

  @Post("/books/presigned")
  async uploadBookDraft(
    @Body()
    body: uploadImageI
  ) {
    const { title, uploadedBy } = body;
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
    const doc = await this.imageService.addImage({
      title,
      s3Path,
      mimeType,
      uploadedBy,
    });
    return { signedURL, id: doc.id };
  }

  @Post("/users/profile/presigned")
  async getPresigned(@Body() body: uploadImageI) {
    const { uploadedBy } = body;
    let { mimeType } = body;
    const title = ProjectPaths.S3_DEFAULT_PROFILE_TITLE;
    let s3Path: string = `${
      ProjectPaths.S3_USER_PROFILE_IMG
    }/${title}${new Date().valueOf()}`;

    const img = await this.imageService.getUserProfileImage({
      id: body.id,
    });
    if (
      img.ProfileImage?.s3Path !== null &&
      img.ProfileImage?.s3Path.length > 0
    ) {
      const signedURL = await this.s3Service.getPresignedURL({
        path: s3Path,
        mimeType,
      });
      return { signedURL };
    }
    const signedURL = await this.s3Service.getPresignedURLForUpload({
      path: s3Path,
      mimeType,
    });
    const doc = await this.imageService.addImage({
      title,
      s3Path,
      mimeType,
      uploadedBy,
    });
    await this.imageService.updateUserProfileImage({
      imgId: doc.id,
      userId: body.id,
    });
    return { signedURL, id: doc.id };
  }
}
