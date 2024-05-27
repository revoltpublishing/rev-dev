import { Body, Controller, Post } from "@nestjs/common";
import { BooksRepository } from "../repositories/book.repository";
import { BookI, filterBookI } from "../interfaces/book.interface";
import { UserService } from "src/modules/user/services/user.service";

@Controller("book")
export class BookController {
  constructor(
    private readonly booksRepo: BooksRepository,
    private readonly usersService: UserService
  ) {}
  @Post("/add")
  addBook(@Body() body: BookI) {
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
}
