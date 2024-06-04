import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ImagesRepository } from "./repositories/image.repository";
import { ImageController } from "./controllers/image.controller";
import { DbClient } from "src/common/services/dbclient.service";
import { S3Service } from "src/common/services/s3.service";

@Module({
  providers: [ImagesRepository, DbClient, S3Service],
  controllers: [ImageController],
  exports: [ImagesRepository, S3Service],
})
export class ProjectModule {}
