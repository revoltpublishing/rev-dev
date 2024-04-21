import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { AcessControlService } from "./services/acess-control.service";
import { DbClient } from "src/common/services/dbclient.service";
import { AccessControlController } from "./controllers/access-control.controller";
import { UsersController } from "./controllers/users.controller";

@Module({
  controllers: [AccessControlController, UsersController],
  providers: [AuthService, AcessControlService, DbClient],
  imports: [],
  exports: [AuthService, AcessControlService],
})
export class UsersModule {}
