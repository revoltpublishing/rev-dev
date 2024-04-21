import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { LoggedInGuard } from "src/common/guards/loggedin.guard";
import { DbClient } from "src/common/services/dbclient.service";
import { UserI } from "../interfaces/user.interface";
import { USER_ROLE_CONSTANTS } from "src/common/constants/roles";

@Controller("users")
export class UsersController {
  constructor(private readonly dbClient: DbClient) {}
  @Post("/sa")
  async check(@Body() params: UserI) {
    // console.log("here!");
    return this.dbClient.user.create({
      data: {
        ...params,
        UserRoleMap: {
          create: {
            roleId: USER_ROLE_CONSTANTS.USER_ROLE__S_AD,
          },
        },
      },
    });
  }
  @Get("/here")
  @UseGuards(LoggedInGuard)
  async here() {
    return "pspsps";
  }
}
