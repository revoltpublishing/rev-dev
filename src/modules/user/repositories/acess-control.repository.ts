import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
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
    const { name, ...rest } = params;
    return this.dbClient.resource.create({
      data: {
        name,
        ResourcePermission: {
          createMany: {
            data: rest.permissions,
          },
        },
      },
    });
  }

  createResourceAttribute(params: resourceAttributeI) {
    const { permissions, ...rest } = params;
    return this.dbClient.resourceAttribute.create({
      data: {
        ...rest,
        ResourceAttributePermission: {
          createMany: {
            data: permissions,
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
    attribute?: { name: string; value: string };
  }) {
    const includeObj: Prisma.ResourceInclude = {
      ResourcePermission: {
        where: {
          roleId: params.roleId,
          action: params.action,
        },
      },
      ResourceAction: {
        where: {
          action: params.attribute ? undefined : params.action,
          Resource: {
            name: params.resc,
          },
        },
      },
    };
    if (params.attribute) {
      includeObj.ResourceAttribute = {
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
          ResourceAttributeAction: {
            where: {
              action: params.action,
              ResourceAttribute: {
                name: params.attribute.name,
                value: params.attribute.value,
              },
            },
          },
        },
      };
    }
    return this.dbClient.resource.findFirst({
      where: { name: params.resc },
      include: includeObj,
    });
  }
  getResourceDetails(params: { name: string; action: number }) {
    return this.dbClient.resource.findFirst({
      where: {
        name: params.name,
      },
      include: {
        ResourceAction: {
          where: {
            action: params.action,
          },
        },
      },
    });
  }
  getResourceAttributebInfo(params: {
    rescId: number;
    atb: {
      name: string;
      value: string;
    };
    action: number;
    roleId: number;
  }) {
    return this.dbClient.resourceAttribute.findMany({
      where: {
        name: params.atb.name,
        value: params.atb.value,
        resourceId: params.rescId,
      },
      include: {
        ResourceAttributePermission: {
          where: {
            action: params.action,
            roleId: params.roleId,
          },
        },
        ResourceAttributeAction: {},
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
  getDynamicServiceMap(params: { resc: string; whereBody: any }) {
    return this.dbClient?.[params.resc].findFirst({
      where: params.whereBody,
    });
  }
}
