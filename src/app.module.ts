import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { UsersModule } from "./modules/user/user.module";
import { ProjectModule } from "./modules/project/project.module";
import { ConfigModule } from "@nestjs/config";
import { BookModule } from "./modules/book/book.module";
import { AccessMiddleware } from "./common/middlewares/userinfo.middleware";

const AppEnvironmentModule = ConfigModule.forRoot({
  envFilePath: "./.env",
  isGlobal: true,
});

@Module({
  imports: [UsersModule, ProjectModule, BookModule, AppEnvironmentModule],
  controllers: [],
  providers: [Logger],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccessMiddleware)
      .exclude(
        { path: "access-control/ping", method: RequestMethod.ALL },
        { path: "access-control/resource", method: RequestMethod.ALL },
        { path: "access-control/resource/action", method: RequestMethod.ALL },
        {
          path: "access-control/resource/action/depends",
          method: RequestMethod.ALL,
        },

        {
          path: "access-control/resource/attribute",
          method: RequestMethod.ALL,
        }
        // { path: "users/add", method: RequestMethod.POST }
      )
      .forRoutes({
        path: "*",
        method: RequestMethod.ALL,
      });
  }
}
