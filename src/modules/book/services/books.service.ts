import { Injectable } from "@nestjs/common";
import { Book, Prisma } from "@prisma/client";
import { S3Service } from "src/common/services/s3.service";
import { ImagesRepository } from "src/modules/project/repositories/image.repository";
import {
  bookStageFlagsI,
  buildCreateBookObjectI,
  createBookI,
  createBookReqI,
  filterBookRepoI,
} from "../interfaces/book.interface";
import { BooksRepository } from "../repositories/book.repository";
import { BOOK_STAGE_TREE, BOOK_STAGES_ENUM } from "../constants/stage";
import { UserService } from "src/modules/user/services/user.service";
import { UserFilterObject } from "src/modules/user/constants/filterObjects";
import { UsersRepository } from "src/modules/user/repositories/user.repository";

@Injectable()
export class BooksService {
  constructor(
    private readonly imagesRepo: ImagesRepository,
    private readonly s3Service: S3Service,
    private readonly bookRepo: BooksRepository,
    private readonly userFilterObj: UserFilterObject
  ) {}

  buildCreateObject(params: buildCreateBookObjectI): createBookI {
    const { initBkStg, ...rest } = params;
    const obj: createBookI = {
      ...rest,
      BookUserMap: {
        createMany: {
          data: [
            ...params.bookUsers.map((v) => ({
              userId: v,
            })),
          ],
        },
      },
      BookDraft: {},
      BookCreatedByUser: {
        connect: {
          id: params.createdBy,
        },
      },
    };
    if (params.draftImageId) {
      obj.BookDraft = {
        connect: {
          id: params.draftImageId,
        },
      };
    }
    if (params.initBkStg) {
      obj.BookStage = {
        createMany: {
          data: [
            ...BOOK_STAGE_TREE.map((v) => ({
              stageId: v.id,
              requirements: null,
            })),
          ],
        },
      };
    }
    return obj;
  }
  buildFindManyFilterObject(params: filterBookRepoI): Prisma.BookFindManyArgs {
    const obj: Prisma.BookFindManyArgs = {
      where: {},
      include: {
        BookUserMap: {
          include: {
            User: this.userFilterObj.buildFilterObject(),
          },
        },
        BookStage: {
          include: {
            BookStageManuscript: {},
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    };
    if (params.pg) obj.skip = params.pg && params.pg == 1 ? 0 : params.pg * 10;
    if (params.offset)
      obj.take = params.offset !== undefined ? params.offset : null;
    if (params.search) {
      obj.where = {
        title: {
          startsWith: params.search,
        },
        BookStage: {},
      };
    }
    if (params.userId) {
      obj.where = {
        ...obj.where,
        BookUserMap: {
          some: {
            userId: params.userId,
          },
        },
      };
    }
    if (params.stage)
      obj.where = {
        ...obj.where,
        BookStage: {
          some: {
            stageId: params.stageId,
          },
        },
      };
    return obj;
  }

  async getFilteredBooks(params: filterBookRepoI) {
    return this.bookRepo.getBooks(this.buildFindManyFilterObject(params));
  }
  async getFilteredBooksCount(params: filterBookRepoI) {
    return this.bookRepo.getBooksCount(
      this.buildFindManyFilterObject({ ...params })
    );
  }

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

  async createBookWithInitStages(params: createBookReqI) {
    return this.bookRepo.createBook(
      this.buildCreateObject({ ...params, initBkStg: true })
    );
  }
  prepareActivityContent(params: { content: string; stageId: number }): string {
    switch (params.stageId) {
      case BOOK_STAGES_ENUM.BOOK_STG_EDTNG:
        params.content = "Editing " + params.content;
        break;
      case BOOK_STAGES_ENUM.BOOK_STG_DESGNG:
        params.content = "Designing " + params.content;
        break;
      case BOOK_STAGES_ENUM.BOOK_STG_TYPSTNG:
        params.content = "Typesetting " + params.content;
        break;
      case BOOK_STAGES_ENUM.BOOK_STG_REVIEW:
        params.content = "Review " + params.content;
        break;
      default:
        break;
    }
    return params.content;
  }
  getActivityContent(params: bookStageFlagsI) {
    if (params.isAccepted)
      return this.prepareActivityContent({
        stageId: params.stageId,
        content: "is accepted",
      });
    if (params.isActive)
      return this.prepareActivityContent({
        stageId: params.stageId,
        content: "is in progress",
      });
    if (params.isCompleted)
      return this.prepareActivityContent({
        stageId: params.stageId,
        content: "is completed",
      });
    if (params.isSubmitted)
      return this.prepareActivityContent({
        stageId: params.stageId,
        content: "is submitted",
      });
    if (params.isWorking !== undefined)
      return this.prepareActivityContent({
        stageId: params.stageId,
        content: params.isWorking ? "is started" : "is completed for now",
      });
  }
}
