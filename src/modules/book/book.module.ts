import { Module } from "@nestjs/common";
import { BookController } from "./controllers/book.controller";
import { BooksRepository } from "./repositories/book.repository";
import { DbClient } from "src/common/services/dbclient.service";
import { UserService } from "../user/services/user.service";
import { ImagesRepository } from "../project/repositories/image.repository";
import { S3Service } from "src/common/services/s3.service";
import { ProjectModule } from "../project/project.module";

@Module({
  controllers: [BookController],
  providers: [
    BooksRepository,
    DbClient,
    ImagesRepository,
    S3Service,
    UserService,
  ],
  exports: [BooksRepository],
  imports: [ProjectModule],
})
export class BookModule {}
