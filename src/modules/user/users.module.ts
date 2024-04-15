import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { AcessControlService } from "./services/acess-control.service";
import { DbClient } from "src/common/services/dbclient.service";

@Module({
  providers: [AuthService, AcessControlService, DbClient],
})
export class UsersModule {}
