import { Body, Controller, Get, Param, Post, Put, Req } from "@nestjs/common";
import { BooksRepository } from "../repositories/book.repository";
import {
  addBookStageReqI,
  createBookI,
  filterBookI,
  updateBookStageI,
} from "../interfaces/book.interface";
import { UserService } from "src/modules/user/services/user.service";
import { BOOK_STAGE_TREE } from "../constants/stage";
import { StatusCodes } from "src/common/constants/status";
import { BooksService } from "../services/books.service";
import { AccessControlRepository } from "src/modules/user/repositories/acess-control.repository";
import { UsersRepository } from "src/modules/user/repositories/user.repository";
import { GOD__VIEW_ROLES } from "src/modules/user/constants/roles";

@Controller("books")
export class BookController {
  constructor(
    private readonly booksRepo: BooksRepository,
    private readonly usersService: UserService,
    private readonly booksService: BooksService
  ) {}
  @Post("/add")
  addBook(@Body() body: createBookI, @Req() req: Request) {
    const { userDetails } = req["context"];
    return this.booksService.createBookWithInitStages({
      ...body,
      createdBy: userDetails.id,
    });
  }

  // filtering based on role required
  @Post("/lookup")
  async list(@Body() body: filterBookI, @Req() req: Request) {
    const { userDetails } = req["context"];
    if (!GOD__VIEW_ROLES.includes(userDetails.roleId)) {
      body.userId = userDetails.id;
    }
    const list = await this.booksService.getFilteredBooks({ ...body });
    const count = await this.booksService.getFilteredBooksCount({ ...body });
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
    return await this.booksService.getBookWithDraftImage(
      await this.booksRepo.getBookById({ id: params.id })
    );
  }
  // changes for bk stage to book id and stage name
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
    return this.booksRepo.updateBookStage({ ...body, id });
  }
  @Get("/stage/:id")
  async getBookStageDetails(@Param() params: { id: string }) {
    const bk = await this.booksRepo.getBookStageById({ id: params.id });
  }
  @Get("/:id/stage/all")
  getBookStages(@Param() params: { id: string }) {
    return this.booksRepo.getBookStages({ bookId: params.id });
  }
}
