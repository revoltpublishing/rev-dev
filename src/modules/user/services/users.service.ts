import { Injectable } from "@nestjs/common";
import { filterUserI, UserI } from "../interfaces/user.interface";
import { DbClient } from "src/common/services/dbclient.service";
import { prismaErrorMapper } from "src/common/mappers/prisma";
import { Prisma } from "@prisma/client";

export const userIncludeObject: Prisma.UserInclude = {
  ProfileImage: true,
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

function firstUpperCase(s: string) {
  return s
    .split("")
    .map((v, i) => (i == 0 ? v.toUpperCase() : v))
    .join("");
}

@Injectable()
export class UsersService {
  constructor(private readonly dbClient: DbClient) {}
  async createUser(params: UserI) {
    const { roleId, ...rest } = params;
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
  async updateUser(params: UserI) {
    return await this.dbClient.user.update({
      data: {
        ...params,
      },
      where: {
        email: params.email,
      },
    });
  }
  buildFilterObject(params: filterUserI): Prisma.UserFindManyArgs {
    const obj: Prisma.UserFindManyArgs = {
      include: userIncludeObject,
      where: {},
    };
    if (params.pg) obj.skip = params.pg && params.pg == 1 ? 0 : params.pg * 10;
    if (params.offset)
      obj.take = params.offset !== undefined ? params.offset : null;
    if (params.search) {
      obj.where.OR = [
        {
          firstName: {
            startsWith: params.search || firstUpperCase(params.search),
          },
        },
        {
          lastName: {
            startsWith: params.search || firstUpperCase(params.search),
          },
        },
      ];
    }
    if (params.roleId)
      obj.where = { ...obj.where, UserRoleMap: { roleId: params.roleId } };
    return obj;
  }
  async getUsers(params: filterUserI) {
    return this.dbClient.user.findMany({ ...this.buildFilterObject(params) });
  }
  async getUsersCount(params: filterUserI) {
    params.offset = undefined;
    params.pg = undefined;
    const res = await this.dbClient.user.findMany({
      ...this.buildFilterObject(params),
    });
    return res.length;
  }
}
