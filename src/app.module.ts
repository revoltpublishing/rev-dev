import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { UsersModule } from "./modules/user/users.module";
import { ProjectModule } from "./modules/project/project.module";
import { BasicAuthMiddleware } from "./common/middlewares/userinfo.middleware";

@Module({
  imports: [UsersModule, ProjectModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BasicAuthMiddleware)
      .exclude(
        { path: "/api/access-control/ping", method: RequestMethod.ALL },
        { path: "/api/access-control/resource", method: RequestMethod.ALL },
        {
          path: "/api/access-control/resource/attribute",
          method: RequestMethod.ALL,
        }
      )
      .forRoutes({
        path: "*",
        method: RequestMethod.ALL,
      });
  }
}
