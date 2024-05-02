import { Injectable } from "@nestjs/common";
import { DbClient } from "src/common/services/dbclient.service";
import { uploadBookDraftI } from "src/modules/book/interfaces/book.interface";

@Injectable()
export class ImageService {
  constructor(private readonly dbClient: DbClient) {}
  async addBookDraftImage(body: uploadBookDraftI) {
    return this.dbClient.image.create({
      data: {
        name: body.name,
        s3Path: body.s3Path,
        mimeType: body.mimeType,
        uploadedByUserId: body.uploadedByUserId,
      },
    });
  }
}
