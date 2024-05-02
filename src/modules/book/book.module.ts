import { Module } from "@nestjs/common";
import { ControllersController } from "./controllers/book.controller";
import { BookService } from "./services/book.service";

@Module({
  controllers: [ControllersController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
