import { Injectable } from "@nestjs/common";
import { DbClient } from "src/common/services/dbclient.service";
import { addBookDraftPageCharacterI } from "../interfaces/draft.interface";

@Injectable()
export class DraftRepository {
  constructor(private readonly dbClient: DbClient) {}
  addDraftPageCharacters(body: addBookDraftPageCharacterI[]) {
    return this.dbClient.bookDraftPageCharacter.createMany({
      data: [...body],
    });
  }
  addDraftPageCharacter(body: addBookDraftPageCharacterI) {
    return this.dbClient.bookDraftPageCharacter.create({
      data: body,
    });
  }
  async getDraftCharactersByPage(body: { bookId: string; pageNo: number }) {
    return this.dbClient.bookDraftPageCharacter.findMany({
      where: {
        bookId: body.bookId,
        pageNo: body.pageNo,
      },
    });
  }
}
