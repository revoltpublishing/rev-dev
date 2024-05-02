import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { S3Service } from "src/common/services/s3.service";
import { BookService } from "../services/book.service";
import { BookI } from "../interfaces/book.interface";

@Controller("book")
export class BookController {
  constructor(private readonly bookService: BookService) {}
  @Post("/add")
  addBook(@Body() body: BookI) {
    return this.bookService.createBook({ ...body });
  }
}
