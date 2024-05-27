import { Module } from "@nestjs/common";
import { AuthService } from "./repositories/auth.repository";
import { AcessControlRepository } from "./repositories/acess-control.repository";
import { DbClient } from "src/common/services/dbclient.service";
import { AccessControlController } from "./controllers/access-control.controller";
import { UserController } from "./controllers/user.controller";
import { UsersRepository } from "./repositories/user.repository";
import { BooksRepository } from "../book/repositories/book.repository";
import { ImagesRepository } from "../project/repositories/image.repository";
import { S3Service } from "src/common/services/s3.service";
import { UserService } from "./services/user.service";
import { ProjectModule } from "../project/project.module";
import { BookModule } from "../book/book.module";

@Module({
  controllers: [AccessControlController, UserController],
  providers: [
    AuthService,
    AccessControlController,
    S3Service,
    AcessControlRepository,
    UsersRepository,
    DbClient,
    BookModule,
    ProjectModule,
    ImagesRepository,
    UserService,
  ],
  imports: [ProjectModule, BookModule],
  exports: [AuthService, AccessControlController],
})
export class UsersModule {}
