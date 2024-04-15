import { Injectable } from "@nestjs/common";
import {
  createResourceParamsI,
  resourceAttributeI,
} from "src/common/interfaces/roles.interface";
import { DbClient } from "src/common/services/dbclient.service";

@Injectable()
export class AcessControlService {
  constructor(private readonly dbClient: DbClient) {}

  createRole(params: { role: number }) {
    return this.dbClient.role.create({
      data: {
        role: params.role,
      },
    });
  }
  createResource(params: createResourceParamsI) {
    const { name, des, ...rest } = params;
    return this.dbClient.resource.create({
      data: {
        name,
        des,
        ResourceAttribute: {
          create: {
            ...rest.attribute,
            ResourceAttributePermission: {
              createMany: {
                data: {
                  ...rest.attribute.permission,
                },
              },
            },
          },
        },
        ResourcePermission: {
          createMany: {
            data: {
              ...rest.permission,
            },
          },
        },
      },
    });
  }
  createResourceAttribute(params: resourceAttributeI) {
    return this.dbClient.resourceAttribute.create({
      data: {
        ...params,
        ResourceAttributePermission: {
          create: {
            ...params.permission,
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
            ResourceAttribute: true,
            ResourcePermission: true,
          },
        },
      },
      where: {
        roleId: params.role,
      },
    });
  }
}
