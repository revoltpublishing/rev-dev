import { Injectable } from "@nestjs/common";
import { UserI } from "../interfaces/user.interface";
import { DbClient } from "src/common/services/dbclient.service";

export const userIncludeObject = {
  UserRoleMap: {
    include: {
      Role: {},
    },
  },
  BookUserMap: {
    include: {
      Book: {},
    },
  },
  UserImageMap: {
    include: {
      Image: {},
    },
  },
};

@Injectable()
export class UsersService {
  constructor(private readonly dbClient: DbClient) {}
  async createUser(params: UserI) {
    return this.dbClient.user.create({
      data: {
        ...params,
        UserRoleMap: {
          create: {
            roleId: params.role,
          },
        },
        BookUserMap: {
          create: {
            bookId: params.bookId,
          },
        },
      },
    });
  }
}
