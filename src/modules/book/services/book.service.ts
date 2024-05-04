import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DbClient } from "src/common/services/dbclient.service";
import { BookI, filterBookI } from "../interfaces/book.interface";
import { Prisma } from "@prisma/client";
import { prismaErrorMapper } from "src/common/mappers/prisma";
import { userIncludeObject } from "src/modules/user/services/users.service";

@Injectable()
export class BookService {
  constructor(private readonly dbClient: DbClient) {}
  buildFilterObject(params: filterBookI): Prisma.BookFindManyArgs {
    const obj: Prisma.BookFindManyArgs = {
      where: {},
      include: {
        BookUserMap: {
          include: {
            User: {
              include: { UserRoleMap: true },
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
            stage: params.stageId,
          },
        },
      };
    return obj;
  }
  async createBook(params: BookI) {
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
      throw prismaErrorMapper(e);
    }
  }
  async addUserToBook(params: { bookId: string; userId: string }) {
    return this.dbClient.bookUserMap.create({
      data: { ...params },
    });
  }
  async getBooks(params: filterBookI) {
    return this.dbClient.book.findMany({ ...this.buildFilterObject(params) });
  }
  async getBooksCount(params: filterBookI) {
    params.offset = undefined;
    params.pg = undefined;
    const res = await this.dbClient.book.findMany({
      ...this.buildFilterObject(params),
    });
    return res.length;
  }
}
