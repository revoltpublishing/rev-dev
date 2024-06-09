import { Injectable } from "@nestjs/common";
import { Book } from "@prisma/client";
import { S3Service } from "src/common/services/s3.service";
import { ImagesRepository } from "src/modules/project/repositories/image.repository";

@Injectable()
export class BooksService {
  constructor(
    private readonly imagesRepo: ImagesRepository,
    private readonly s3Service: S3Service
  ) {}

  async getBookWithDraftImage(book: Book) {
    if (book.draftImageId === null) return book;
    const img = await this.imagesRepo.getImageById({
      id: book.draftImageId,
    });
    const signedURL = await this.s3Service.getPresignedURL({
      path: img.s3Path,
      mimeType: img.mimeType,
    });
    return { ...book, draftSignedURL: signedURL };
  }
}
