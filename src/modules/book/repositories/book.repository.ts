import { Injectable } from "@nestjs/common";
import { DbClient } from "src/common/services/dbclient.service";
import {
  addBookStageI,
  bookI,
  bookUserI,
  filterBookI,
  updateBookStageI,
} from "../interfaces/book.interface";
import { Prisma } from "@prisma/client";
import { prismaErrorMapper } from "src/common/mappers/prisma";

@Injectable()
export class BooksRepository {
  constructor(private readonly dbClient: DbClient) {}
  buildFilterObject(params: filterBookI): Prisma.BookFindManyArgs {
    const obj: Prisma.BookFindManyArgs = {
      where: {},
      include: {
        BookUserMap: {
          include: {
            User: {
              include: { UserRoleMap: true, ProfileImage: true },
            },
          },
        },
        BookStage: {},
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

  async createBook(params: bookI) {
    const { bookUsers, ...rest } = params;
    try {
      return await this.dbClient.book.create({
        data: {
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

  async getBooks(params: filterBookI) {
    return await this.dbClient.book.findMany(this.buildFilterObject(params));
  }
  async getBooksCount(params: filterBookI) {
    params.offset = undefined;
    params.pg = undefined;
    const res = await this.dbClient.book.findMany({
      ...this.buildFilterObject(params),
    });
    return res.length;
  }
  async addBookStageDetails(params: addBookStageI) {
    return this.dbClient.bookStage.create({
      data: params,
    });
  }
  async updateBookStage(params: updateBookStageI) {
    const { bookId, stageId, ...rest } = params;
    return this.dbClient.bookStage.update({
      where: {
        bookId_stageId: { bookId, stageId },
      },
      data: { ...rest },
    });
  }
  async getBookStage(params: { bookId: string; stageId: number }) {
    return await this.dbClient.bookStage.findFirst({
      where: { bookId: params.bookId, stageId: params.stageId },
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
  async getBookById(params: { id: string }) {
    return this.dbClient.book.findFirst({
      where: { id: params.id },
      include: {
        BookStage: {
          include: {
            BookStageImageMap: {
              include: {
                Image: true,
              },
            },
          },
        },
        BookDraft: {},
      },
    });
  }
}
