import { Injectable } from "@nestjs/common";
import { DbClient } from "src/common/services/dbclient.service";
import {
  addBookStageI,
  addManuscriptActivityI,
  bookI,
  bookUserI,
  createBookI,
  filterBookI,
  updateBookStageI,
} from "../interfaces/book.interface";
import { Prisma } from "@prisma/client";
import { prismaErrorMapper } from "src/common/mappers/prisma";

@Injectable()
export class BooksRepository {
  constructor(private readonly dbClient: DbClient) {}
  async createBook(params: createBookI) {
    const { bookUsers, createdBy, draftImageId, ...rest } = params;
    try {
      return await this.dbClient.book.create({
        data: {
          ...rest,
        },
      });
    } catch (e) {
      throw prismaErrorMapper(e.message);
    }
  }
  async addUserToBook(params: bookUserI) {
    return this.dbClient.bookUserMap.create({
      data: { ...params },
    });
  }

  async getBooks(params: Prisma.BookFindManyArgs) {
    return await this.dbClient.book.findMany(params);
  }
  async getBooksCount(params: Prisma.BookFindManyArgs) {
    const res = await this.dbClient.book.findMany({
      ...params,
    });
    return res.length;
  }
  async addBookStageDetails(params: addBookStageI) {
    return this.dbClient.bookStage.create({
      data: params,
    });
  }
  async updateBookStage(params: updateBookStageI) {
    const { id, ...rest } = params;
    return this.dbClient.bookStage.update({
      where: {
        id,
      },
      data: { ...rest },
    });
  }
  async getBookStageById(params: { id: string }) {
    return await this.dbClient.bookStage.findFirst({
      where: { id: params.id },
      include: {
        BookStageImageMap: {
          include: { Image: {} },
        },
      },
    });
  }
  async getBookStages(params: { bookId: string }) {
    return await this.dbClient.bookStage.findMany({
      where: { bookId: params.bookId },
      include: {
        BookStageImageMap: {
          include: { Image: {} },
        },
      },
    });
  }
  async getBookById(params: { id: string; stageId?: number }) {
    return this.dbClient.book.findFirst({
      where: { id: params.id },
      include: {
        BookStage: {
          ...(params.stageId && {
            where: {
              stageId: params.stageId,
            },
          }),
          include: {
            BookStageImageMap: {
              include: {
                Image: true,
              },
            },
            BookStageManuscript: {
              include: {
                BookStageManuscriptActivity: {},
              },
            },
          },
        },
        BookDraft: {},
      },
    });
  }
  async getUserBooks(params: { userId: string }) {
    return this.dbClient.bookUserMap.findMany({
      where: {
        userId: params.userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
  async addManuscriptActivity(params: addManuscriptActivityI) {
    return this.dbClient.bookStageManuscriptActivity.create({
      data: { ...params },
    });
  }
  async getManuscriptActivityById(params: { mid: string }) {
    return this.dbClient.bookStageManuscriptActivity.findMany({
      where: {
        bkStgManuId: params.mid,
      },
    });
  }
}
