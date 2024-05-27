import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { S3Service } from "src/common/services/s3.service";
import { ImagesRepository } from "src/modules/project/repositories/image.repository";

@Injectable()
export class UserService {
  constructor(
    private readonly imagesRepo: ImagesRepository,
    private readonly s3Service: S3Service
  ) {}

  async getUserWithImage(user: User) {
    if (user.profileImageId === null) return user;
    const img = await this.imagesRepo.getImageById({
      id: user.profileImageId,
    });
    const s3Path = img.s3Path;
    const mimeType = img.mimeType;
    const signedURL = await this.s3Service.getPresignedURL({
      path: s3Path,
      mimeType,
    });
    const temp = { ...user, signedURL: signedURL };
    return temp;
  }
}
