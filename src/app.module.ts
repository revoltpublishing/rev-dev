import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { UsersModule } from "./modules/user/users.module";
import { ProjectModule } from "./modules/project/project.module";
import { BasicAuthMiddleware } from "./common/middlewares/userinfo.middleware";
import { ConfigModule } from "@nestjs/config";
import { S3Service } from "./common/services/s3.service";
import { BookModule } from "./modules/book/book.module";

const AppEnvironmentModule = ConfigModule.forRoot({
  envFilePath: "./.env",
  isGlobal: true,
});

@Module({
  imports: [UsersModule, ProjectModule, BookModule, AppEnvironmentModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer;
    // .apply(BasicAuthMiddleware)
    // .exclude(
    //   { path: "/api/access-control/ping", method: RequestMethod.ALL },
    //   { path: "/api/access-control/resource", method: RequestMethod.ALL },
    //   {
    //     path: "/api/access-control/resource/attribute",
    //     method: RequestMethod.ALL,
    //   }
    // )
    // .forRoutes({
    //   path: "*",
    //   method: RequestMethod.ALL,
    // });
  }
}
