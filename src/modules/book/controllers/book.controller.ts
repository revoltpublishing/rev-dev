import { Body, Controller, Get, Param, Post, Put, Req } from "@nestjs/common";
import { BooksRepository } from "../repositories/book.repository";
import {
  addBookStageReqI,
  bookI,
  filterBookI,
  updateBookStageI,
} from "../interfaces/book.interface";
import { UserService } from "src/modules/user/services/user.service";
import { BOOK_STAGE_TREE } from "../constants/stage";
import { StatusCodes } from "src/common/constants/status";
import { BooksService } from "../services/books.service";

@Controller("books")
export class BookController {
  constructor(
    private readonly booksRepo: BooksRepository,
    private readonly usersService: UserService,
    private readonly booksSerivce: BooksService
  ) {}
  @Post("/add")
  addBook(@Body() body: bookI, @Req() req: Request) {
    const { userDetails } = req["context"];
    return this.booksRepo.createBook({ ...body, createdBy: userDetails.id });
  }
  @Post("/lookup")
  async list(@Body() body: filterBookI) {
    const list = await this.booksRepo.getBooks({ ...body });
    const count = await this.booksRepo.getBooksCount({ ...body });
    const listRes = await Promise.all(
      list.map(async (ls) => {
        const ud = ls["BookUserMap"];
        ls["BookUserMap"] = await Promise.all(
          ud.map((u) => this.usersService.getUserWithImage(u["User"]))
        );
        return ls;
      })
    );
    return { count, list: listRes };
  }
  @Get("/:id")
  async getBookById(@Param() params: { id: string }) {
    return await this.booksSerivce.getBookWithDraftImage(
      await this.booksRepo.getBookById({ id: params.id })
    );
  }
  @Post("/:id/stage/add")
  async addBookStage(@Param("id") id: string, @Body() body: addBookStageReqI) {
    const bkStgs = await this.booksRepo.getBookStages({ bookId: id });
    const stgD = BOOK_STAGE_TREE.find((st) => st.stage === body.stage);
    if (stgD.prevId !== null) {
      stgD.prevId.forEach((st) => {
        const bkStage = bkStgs.find((bkStg) => bkStg.stageId === st);
        if (!bkStage) throw StatusCodes.INVALID_BOOK_STAGE_REDIRECTION;
      });
    }
    return this.booksRepo.addBookStageDetails({ ...body, stageId: stgD.id });
  }
  @Put("/:id/stage")
  updateBookStage(@Param("id") id: string, @Body() body: updateBookStageI) {
    return this.booksRepo.updateBookStage({ ...body, bookId: id });
  }
  @Get("/:id/stage/:stage")
  getBookStageDetails(@Param() params: { id: string; stage: string }) {
    const stgD = BOOK_STAGE_TREE.find((st) => st.stage === params.stage);
    if (!stgD) throw StatusCodes.INVAID_GENERAL;
    return this.booksRepo.getBookStage({ bookId: params.id, stageId: stgD.id });
  }
  @Get("/:id/stage")
  getBookStages(@Param() params: { id: string }) {
    return this.booksRepo.getBookStages({ bookId: params.id });
  }
}
