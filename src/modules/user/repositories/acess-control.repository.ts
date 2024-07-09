import { Injectable } from "@nestjs/common";
import { DbStatusCodes } from "src/common/constants/status";
import {
  createResourceParamsI,
  resourceAttributeI,
} from "src/common/interfaces/roles.interface";
import { DbClient } from "src/common/services/dbclient.service";

@Injectable()
export class AccessControlRepository {
  constructor(private readonly dbClient: DbClient) {}
  createRole(params: { role: string; id: number }) {
    return this.dbClient.roleMaster.create({
      data: {
        ...params,
      },
    });
  }
  createResource(params: createResourceParamsI) {
    const { name, des, ...rest } = params;
    return this.dbClient.resource.create({
      data: {
        name,
        ResourcePermission: {
          createMany: {
            data: rest.permission,
          },
        },
      },
    });
  }

  createResourceAttribute(params: resourceAttributeI) {
    const { permission, ...rest } = params;
    return this.dbClient.resourceAttribute.create({
      data: {
        ...rest,
        ResourceAttributePermission: {
          createMany: {
            data: permission,
          },
        },
      },
    });
  }

  getResourcesByRole(params: { role: number }) {
    return this.dbClient.resourcePermission.findMany({
      include: {
        Resource: {
          include: {
            ResourceAttribute: {
              include: {
                ResourceAttributePermission: {},
              },
            },
          },
        },
      },
      where: {
        roleId: params.role,
      },
    });
  }
  async getResourceInfo(params: {
    resc: string;
    roleId: number;
    action: number;
    attribute: { name: string; value: string };
  }) {
    return this.dbClient.resource.findFirst({
      where: { name: params.resc },
      include: {
        ResourcePermission: {
          where: {
            roleId: params.roleId,
            action: params.action,
          },
        },
        ResourceAttribute: {
          where: {
            name: params.attribute.name,
            value: params.attribute.value,
          },
          include: {
            ResourceAttributePermission: {
              where: {
                roleId: params.roleId,
                action: params.action,
              },
            },
          },
        },
      },
    });
  }
  getResourceAttributebInfo(params: { resc: string; atb: string }) {
    return this.dbClient.resourceAttribute.findMany({
      where: {
        name: params.atb,
        Resource: {
          name: params.resc,
        },
      },
      include: {
        Resource: {
          include: {
            ResourcePermission: {},
          },
        },
        ResourceAttributePermission: {},
      },
    });
  }
  getRoleInfoByRole(params: { role: string }) {
    try {
      return this.dbClient.roleMaster.findFirst({
        where: {
          ...params,
        },
      });
    } catch (e) {
      throw DbStatusCodes.ROLE_DOESNOT_EXISTS;
    }
  }
  getRoleInfoById(params: { id: number }) {
    try {
      return this.dbClient.roleMaster.findFirst({
        where: {
          ...params,
        },
      });
    } catch (e) {
      throw DbStatusCodes.ROLE_DOESNOT_EXISTS;
    }
  }
}
