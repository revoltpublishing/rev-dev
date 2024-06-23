import { ImagesRepository } from "../repositories/image.repository";
import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { S3Service } from "src/common/services/s3.service";
import { ProjectPaths } from "src/common/constants/paths";
import { uploadImageI } from "src/modules/book/interfaces/book.interface";

@Controller("images")
export class ImageController {
  constructor(
    private readonly imagesRepo: ImagesRepository,
    private readonly s3Service: S3Service
  ) {}

  async getImageForEntity() {}

  @Post("/users/profile/presigned")
  async getPresigned(@Body() body: uploadImageI, @Req() req: Request) {
    const { userDetails } = req["context"];
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
        path: img.ProfileImage.s3Path,
        mimeType: img.ProfileImage.mimeType,
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
      uploadedBy: userDetails.id,
    });
    await this.imagesRepo.updateUserProfileImage({
      imgId: doc.id,
      userId: body.id,
    });
    return { signedURL, id: doc.id };
  }

  @Post("/books/stage/:bkStgId")
  async addBookStageImage(
    @Param() params: { bkStgId: string },
    @Req() req: Request,
    @Body() body: uploadImageI
  ) {
    const { userDetails } = req["context"];
    let { mimeType } = body;
    let s3Path: string = `${ProjectPaths.S3_BOOK_STAGE_IMG}/${
      ProjectPaths.S3_DEFAULT_STAGE_IMG_TITLE
    }${new Date().valueOf()}`;
    const signedURL = await this.s3Service.getPresignedURLForUpload({
      path: s3Path,
      mimeType,
    });
    const img = await this.imagesRepo.addBookStageMapImage({
      bkStgId: params.bkStgId,
      uploadedBy: userDetails.id,
      s3Path,
      name: body.title,
      mimeType,
    });
    return { signedURL, id: img.id };
  }
  @Get("/books/stage/:bkStgId")
  async getBookStageImages(@Param() params: { bkStgId: string }) {
    const img = await this.imagesRepo.getBookStageImages(params);
    return Promise.all(
      img.map(async (v) => {
        const signedURL = await this.s3Service.getPresignedURL({
          path: v.Image.s3Path,
          mimeType: v.Image.mimeType,
        });
        return { signedURL, ...v };
      })
    );
  }
}
