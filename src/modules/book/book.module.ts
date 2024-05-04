import { Module } from "@nestjs/common";
import { BookController } from "./controllers/book.controller";
import { BookService } from "./services/book.service";
import { DbClient } from "src/common/services/dbclient.service";

@Module({
  controllers: [BookController],
  providers: [BookService, DbClient],
  exports: [BookService],
})
export class BookModule {}
