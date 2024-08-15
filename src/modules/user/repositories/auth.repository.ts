import { Injectable } from "@nestjs/common";
import { DbClient } from "src/common/services/dbclient.service";
import { UserFilterObject } from "../constants/filterObjects";

@Injectable()
export class AuthService {
  constructor(
    private readonly dbClient: DbClient,
    private readonly userFilterObj: UserFilterObject
  ) {}

  async getUserInfoByAccessToken(params: { token: string }) {
    return this.dbClient.user.findUnique({
      where: {
        accessToken: params.token,
      },
      include: this.userFilterObj.userIncludeObject,
    });
  }
}
