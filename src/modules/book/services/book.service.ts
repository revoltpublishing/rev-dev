import { Injectable } from "@nestjs/common";
import { DbClient } from "src/common/services/dbclient.service";
import { BookI, uploadBookDraftI } from "../interfaces/book.interface";

@Injectable()
export class BookService {
  constructor(private readonly dbClient: DbClient) {}
  async createBook(body: BookI) {
    return this.dbClient.book.create({
      data: {
        ...body,
        BookUserMap: {
          createMany: {
            data: body.bookUsers.map((val) => ({
              userId: val,
            })),
          },
        },
      },
    });
  }
  async addUserToBook(body: { bookId: string; userId: string }) {
    return this.dbClient.bookUserMap.create({
      data: { ...body },
    });
  }
}
