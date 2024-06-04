import { Injectable } from "@nestjs/common";
import { DbClient } from "src/common/services/dbclient.service";
import { uploadImageI } from "src/modules/book/interfaces/book.interface";
import { uploadBookStageImageI } from "../interfaces/images.interface";

@Injectable()
export class ImagesRepository {
  constructor(private readonly dbClient: DbClient) {}
  async addImage(params: uploadImageI) {
    return this.dbClient.image.create({
      data: {
        name: params.title,
        s3Path: params.s3Path,
        mimeType: params.mimeType,
        uploadedBy: params.uploadedBy,
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
  async addBookStageMapImage(params: uploadBookStageImageI) {
    return this.dbClient.image.create({
      data: {
        name: params.name,
        s3Path: params.s3Path,
        uploadedBy: params.uploadedBy,
        mimeType: params.mimeType,
        BookStageImageMap: {
          create: {
            bookId: params.bookId,
            stageId: params.stageId,
          },
        },
      },
    });
  }
}
