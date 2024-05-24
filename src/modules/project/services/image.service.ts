import { Injectable } from "@nestjs/common";
import { DbClient } from "src/common/services/dbclient.service";
import { uploadImageI } from "src/modules/book/interfaces/book.interface";

@Injectable()
export class ImageService {
  constructor(private readonly dbClient: DbClient) {}
  async addImage(params: uploadImageI) {
    return this.dbClient.image.create({
      data: {
        name: params.title,
        s3Path: params.s3Path,
        mimeType: params.mimeType,
        uploadedByUserId: params.uploadedBy,
      },
    });
  }
  async getImageById(params: { id: string }) {
    return this.dbClient.image.findFirst({ where: { id: params.id } });
  }
  async getDraftImage(params: { id: string }) {
    return this.dbClient.book.findFirst({
      where: { id: params.id },
      include: {
        Image: true,
      },
    });
  }
  async getUserProfileImage(params: { id: string }) {
    return this.dbClient.user.findFirst({
      where: { id: params.id },
      include: {
        ProfileImage: true,
      },
    });
  }
  async updateUserProfileImage(params: { imgId: string; userId: string }) {
    return this.dbClient.user.update({
      data: {
        profileImageId: params.imgId,
      },
      where: { id: params.userId },
    });
  }
  prepareSignedURLForUserProfile;
}
