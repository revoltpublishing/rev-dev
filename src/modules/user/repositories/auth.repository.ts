import { Injectable } from "@nestjs/common";
import { DbClient } from "src/common/services/dbclient.service";
import { userIncludeObject } from "./user.repository";

@Injectable()
export class AuthService {
  constructor(private readonly dbClient: DbClient) {}

  async getUserInfoByAccessToken(params: { token: string }) {
    return this.dbClient.user.findFirst({
      where: {
        accessToken: params.token,
      },
      include: userIncludeObject,
    });
  }
}
