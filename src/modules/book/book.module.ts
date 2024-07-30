import { Logger, Module } from "@nestjs/common";
import { BookController } from "./controllers/book.controller";
import { BooksRepository } from "./repositories/book.repository";
import { DbClient } from "src/common/services/dbclient.service";
import { UserService } from "../user/services/user.service";
import { ImagesRepository } from "../project/repositories/image.repository";
import { S3Service } from "src/common/services/s3.service";
import { ProjectModule } from "../project/project.module";
import { DraftController } from "./controllers/draft.controller";
import { BooksService } from "./services/books.service";
import { DraftRepository } from "./repositories/draft.repository";
import { DraftService } from "./services/draft.service";
import { AccessControlRepository } from "../user/repositories/acess-control.repository";
import { UserFilterObject } from "../user/constants/filterObjects";
import { UsersRepository } from "../user/repositories/user.repository";
import { UsersModule } from "../user/user.module";

@Module({
  controllers: [BookController, DraftController],
  providers: [
    BooksRepository,
    DbClient,
    ImagesRepository,
    S3Service,
    UserService,
    BooksService,
    DraftRepository,
    DraftService,
    AccessControlRepository,
    UserFilterObject,
    UsersRepository,
    Logger,
  ],
  exports: [BooksRepository],
  imports: [ProjectModule],
})
export class BookModule {}
