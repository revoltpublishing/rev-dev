import { Logger, Module } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { AccessControlRepository } from "./repositories/acess-control.repository";
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
import { UserFilterObject } from "./constants/filterObjects";
import { AccessGuard } from "src/common/guards/access.guard";
import {
  ResourceAttributeGuard,
  ResourceGuard,
} from "src/common/guards/resource.guard";

@Module({
  controllers: [AccessControlController, UserController],
  providers: [
    AuthService,
    S3Service,
    AccessControlRepository,
    UsersRepository,
    DbClient,
    BookModule,
    ProjectModule,
    ImagesRepository,
    UserService,
    Logger,
    UserFilterObject,
    AccessGuard,
    ResourceGuard,
    ResourceAttributeGuard,
  ],
  imports: [ProjectModule, BookModule],
  exports: [AuthService, AccessControlRepository],
})
export class UsersModule {}
