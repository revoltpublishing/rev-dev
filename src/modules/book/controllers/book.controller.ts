import { Body, Controller, Post } from "@nestjs/common";
import { BookService } from "../services/book.service";
import { BookI, filterBookI } from "../interfaces/book.interface";
import { MessageError } from "src/common/constants/status";

@Controller("books")
export class BookController {
  constructor(private readonly bookService: BookService) {}
  @Post("/add")
  addBook(@Body() body: BookI) {
    return this.bookService.createBook({ ...body });
  }
  @Post("/lookup")
  async list(@Body() body: filterBookI) {
    const list = await this.bookService.getBooks({ ...body });
    const count = await this.bookService.getBooksCount({ ...body });
    return { count, list };
  }
}
