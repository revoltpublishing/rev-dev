import { Body, Controller, Param, Post, Put } from "@nestjs/common";
import { BooksRepository } from "../repositories/book.repository";
import {
  addBookStageI,
  bookI,
  filterBookI,
  updateBookStageI,
} from "../interfaces/book.interface";
import { UserService } from "src/modules/user/services/user.service";

@Controller("books")
export class BookController {
  constructor(
    private readonly booksRepo: BooksRepository,
    private readonly usersService: UserService
  ) {}
  @Post("/add")
  addBook(@Body() body: bookI) {
    return this.booksRepo.createBook({ ...body });
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
  @Post("/:id/stage/add")
  addBookStage(@Param("id") id: string, @Body() body: addBookStageI) {
    return this.booksRepo.addBookStageDetails(body);
  }
  @Put("/:id/stage")
  updateBookStage(@Param("id") id: string, @Body() body: updateBookStageI) {
    return this.booksRepo.updateBookStage(body);
  }
}
