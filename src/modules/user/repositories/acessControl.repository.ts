import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DbStatusCodes } from "src/common/constants/status";
import {
  createResourceActionI,
  createResourceParamsI,
  resourceAttributeBodyI,
  resourceActionDependI,
  resourceActionI,
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
    const { name } = params;
    return this.dbClient.resource.create({
      data: {
        name,
        ResourceAction: {
          create: {
            action: params.action.action,
            ResourceActionPermission: {
              create: params.action.permissions,
            },
            ...(params.action.depends && {
              ResourceActionDepend: {
                create: params.action.depends,
              },
            }),
          },
        },
      },
      include: {
        ResourceAction: {},
        ResourceActionDepend: {},
        ResourceAttribute: {},
      },
    });
  }
  createResourceActionDepends(params: resourceActionDependI[]) {
    return this.dbClient.resourceActionDepend.createMany({
      data: params,
    });
  }

  createResourceAction(params: createResourceActionI) {
    return this.dbClient.resourceAction.create({
      data: {
        action: params.action,
        resourceId: params.resourceId,
        ...(params.depends && {
          ResourceActionDepend: {
            createMany: {
              data: params.depends,
            },
          },
        }),
        ResourceActionPermission: {
          createMany: {
            data: params.permissions,
          },
        },
      },
      include: {
        ResourceActionPermission: {},
        ResourceActionDepend: {},
        Resource: {},
      },
    });
  }

  createResourceAttribute(params: resourceAttributeI) {
    return this.dbClient.resourceAttribute.create({
      data: {
        name: params.name,
        value: params.value,
        resourceId: params.resourceId,
        ResourceAttributeAction: {
          create: {
            action: params.action.action,
            ...(params.action.depends && {
              ResourceAttributeActionDepend: {
                createMany: {
                  data: params.action.depends,
                },
              },
            }),
            ResourceAttributeActionPermission: {
              createMany: {
                data: params.action.permissions,
              },
            },
          },
        },
      },
      include: {
        ResourceAttributeAction: {},
        ResourceActionDepend: {},
        ResourceAttributeActionDepend: {},
        Resource: {},
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
      ResourceAction: {
        where: {
          action: params.action,
          Resource: {
            name: params.resc,
          },
        },
        include: {
          ResourceActionPermission: {},
          ResourceActionDepend: {},
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
          ResourceAttributeAction: {
            include: {
              ResourceAttributeActionDepend: {
                include: {
                  Resource: {},
                  ResourceAttribute: {},
                },
              },
              ResourceAttributeActionPermission: {
                include: {},
              },
            },
          },
        },
      };
    }
    return this.dbClient.resource.findFirst({
      where: { name: params.resc },
      include: {
        ResourceAction: {
          where: {
            action: params.action,
          },
          include: {
            ResourceActionPermission: {
              where: {
                roleId: params.roleId,
              },
            },
            ResourceActionDepend: {},
          },
        },
        ...(params.attribute && {
          ResourceAttribute: {
            where: {
              name: params.attribute.name,
              value: params.attribute.value,
            },
            include: {
              ResourceAttributeAction: {
                where: {
                  action: params.action,
                },
                include: {
                  ResourceAttributeActionDepend: {},
                  ResourceAttributeActionPermission: {
                    where: {
                      roleId: params.roleId,
                    },
                  },
                },
              },
            },
          },
        }),
      },
    });
  }
  getResourceDetails(params: { name: string; action: number; roleId: number }) {
    return this.dbClient.resource.findFirst({
      where: {
        name: params.name,
      },
      include: {
        ResourceAction: {
          where: {
            action: params.action,
          },
          include: {
            ResourceActionDepend: {},
            ResourceActionPermission: {
              where: {
                roleId: params.roleId,
              },
            },
          },
        },
      },
    });
  }
  getResourceAttributesInfo(params: {
    rescId: number;
    atb?: {
      name: string;
      value: string;
    };
    action: number;
    roleId: number;
  }) {
    return this.dbClient.resourceAttribute.findFirst({
      where: {
        ...(params.atb && { name: params.atb.name, value: params.atb.value }),
        resourceId: params.rescId,
      },
      include: {
        ResourceAttributeAction: {
          include: {
            ResourceAttributeActionPermission: {
              where: {
                roleId: params.roleId,
              },
            },
            ResourceAttributeActionDepend: {},
          },
        },
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
  getResourcesPermission(params: {
    resources: {
      name: string;
      action: number;
      atb?: resourceAttributeBodyI;
    }[];
    roleId: number;
  }) {
    return this.dbClient.resource.findMany({
      where: {
        OR: params.resources.map((res) => ({
          name: res.name,
          ResourceAction: {
            some: {
              action: res.action,
              ResourceActionPermission: {
                some: {
                  roleId: params.roleId,
                },
              },
            },
          },
          ...(res.atb && {
            ResourceAttribute: {
              some: {
                ...res.atb,
                ResourceAttributeAction: {
                  some: {
                    action: res.atb.action,
                    ResourceAttributeActionPermission: {
                      some: {
                        roleId: params.roleId,
                      },
                    },
                  },
                },
              },
            },
          }),
        })),
      },
      include: {
        ResourceAttribute: {
          include: {
            ResourceAttributeAction: {
              include: {
                ResourceAttributeActionPermission: {
                  where: {
                    roleId: params.roleId,
                  },
                },
              },
            },
          },
        },
        ResourceAction: {
          include: {
            ResourceActionPermission: {
              where: {
                roleId: params.roleId,
              },
            },
          },
        },
      },
    });
  }
}
