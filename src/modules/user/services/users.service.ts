import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserI } from "../interfaces/user.interface";
import { DbClient } from "src/common/services/dbclient.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { DbStatusCodes } from "src/common/constants/status";
import { prismaErrorMapper } from "src/common/mappers/prisma";

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
  async createUser(body: UserI) {
    const { roleId, ...rest } = body;
    try {
      return await this.dbClient.user.create({
        data: {
          ...rest,
          UserRoleMap: {
            create: {
              roleId,
            },
          },
        },
      });
    } catch (e) {
      return prismaErrorMapper(e);
    }
  }
  async updateUser(body: UserI) {
    return await this.dbClient.user.update({
      data: {
        ...body,
      },
      where: {
        email: body.email,
      },
    });
  }
}
