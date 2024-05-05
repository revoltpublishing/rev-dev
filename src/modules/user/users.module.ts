import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { AcessControlService } from "./services/acess-control.service";
import { DbClient } from "src/common/services/dbclient.service";
import { AccessControlController } from "./controllers/access-control.controller";
import { UserController } from "./controllers/users.controller";
import { UsersService } from "./services/users.service";
import { BookService } from "../book/services/book.service";
import { ImageService } from "../project/services/image.service";
import { S3Service } from "src/common/services/s3.service";

@Module({
  controllers: [AccessControlController, UserController],
  providers: [
    AuthService,
    AcessControlService,
    UsersService,
    DbClient,
    BookService,
    ImageService,
    S3Service,
  ],
  imports: [],
  exports: [AuthService, AcessControlService],
})
export class UsersModule {}
