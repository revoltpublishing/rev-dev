import { Module } from "@nestjs/common";
import { ImageService } from "./services/image.service";
import { ImageController } from "./controllers/image.controller";
import { DbClient } from "src/common/services/dbclient.service";
import { S3Service } from "src/common/services/s3.service";

@Module({
  providers: [ImageService, DbClient, S3Service],
  controllers: [ImageController],
})
export class ProjectModule {}
