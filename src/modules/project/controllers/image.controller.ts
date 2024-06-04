import { uploadImageReqI } from "../interfaces/images.interface";
import { ImagesRepository } from "../repositories/image.repository";
import { Body, Controller, Post } from "@nestjs/common";
import { S3Service } from "src/common/services/s3.service";
import { ProjectPaths } from "src/common/constants/paths";
import { uploadImageI } from "src/modules/book/interfaces/book.interface";

@Controller("images")
export class ImageController {
  constructor(
    private readonly imagesRepo: ImagesRepository,
    private readonly s3Service: S3Service
  ) {}

  @Post("/users/profile/presigned")
  async getPresigned(@Body() body: uploadImageI) {
    const { uploadedBy } = body;
    let { mimeType } = body;
    const title = ProjectPaths.S3_DEFAULT_PROFILE_TITLE;
    let s3Path: string = `${
      ProjectPaths.S3_USER_PROFILE_IMG
    }/${title}${new Date().valueOf()}`;

    const img = await this.imagesRepo.getUserProfileImage({
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
    const doc = await this.imagesRepo.addImage({
      title,
      s3Path,
      mimeType,
      uploadedBy,
    });
    await this.imagesRepo.updateUserProfileImage({
      imgId: doc.id,
      userId: body.id,
    });
    return { signedURL, id: doc.id };
  }
}
