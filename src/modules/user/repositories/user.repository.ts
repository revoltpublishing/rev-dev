import { Injectable, Logger } from "@nestjs/common";
import {
  filterUserRepoI,
  updateUserI,
  UserI,
} from "../interfaces/user.interface";
import { DbClient } from "src/common/services/dbclient.service";
import { prismaErrorMapper } from "src/common/mappers/prisma";
import { UserFilterObject } from "../constants/filterObjects";

@Injectable()
export class UsersRepository {
  constructor(
    private readonly dbClient: DbClient,
    private readonly logger: Logger,
    private readonly userFilterObj: UserFilterObject
  ) {}
  async createUser(params: UserI) {
    try {
      return await this.dbClient.user.create({
        data: {
          ...params,
        },
      });
    } catch (e) {
      this.logger.error(e);
      return prismaErrorMapper(e);
    }
  }
  async updateUser(params: updateUserI) {
    return await this.dbClient.user.update({
      data: {
        firstName: params.firstName,
        lastName: params.lastName,
        accessToken: params.accessToken,
        password: params.password,
        mobile: params.mobile,
        mobileRegion: params.mobileRegion,
      },
      where: {
        email: params.email,
      },
    });
  }

  async getUsers(params: filterUserRepoI) {
    return this.dbClient.user.findMany({
      ...this.userFilterObj.buildFilterObject(params),
    });
  }
  async getUsersCount(params: filterUserRepoI) {
    params.offset = undefined;
    params.pg = undefined;
    const res = await this.dbClient.user.findMany({
      ...this.userFilterObj.buildFilterObject(params),
    });
    return res.length;
  }
  async getUserById(params: { id: string }) {
    return this.dbClient.user.findFirst({
      where: { id: params.id },
      select: this.userFilterObj.userSelectObject,
    });
  }
  async getUserByEmailOrMobile(params: { value: string }) {
    return this.dbClient.user.findFirst({
      where: {
        OR: [
          {
            email: params.value,
          },
          {
            mobile: params.value,
          },
        ],
      },
      include: {
        Role: {},
      },
    });
  }
}
