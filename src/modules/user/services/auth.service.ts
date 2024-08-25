import { Inject, Injectable, Logger } from "@nestjs/common";
import { DbClient } from "src/common/services/dbclient.service";
import { UserFilterObject } from "../constants/filterObjects";
import { AccessControlRepository } from "../repositories/acessControl.repository";
import { CommonExceptions } from "src/common/constants/status";

@Injectable()
export class AuthService {
  constructor(
    private readonly dbClient: DbClient,
    private readonly accessControlRepo: AccessControlRepository,
    private readonly userFilterObj: UserFilterObject,
    private readonly logger: Logger,
    @Inject("REQUEST")
    private readonly req: Request
  ) {}

  async getUserInfoByAccessToken(params: { token: string }) {
    return this.dbClient.user.findUnique({
      where: {
        accessToken: params.token,
      },
      include: this.userFilterObj.userIncludeObject,
    });
  }
  async checkForDependentResource(params: {
    name: string;
    action: number;
    roleId: number;
  }) {
    // const { reqContext } = params;
    const resD = await this.accessControlRepo.getResourceDetails({
      name: params.name,
      action: params.action,
      roleId: params.roleId,
    });
    this.req.headers["_dependencyResource"] = params.name;
    if (resD.ResourceAction[0].ResourceActionPermission[0].isCreated) {
      this.req.headers["_dependencyResource_Part"] = "isCreated";
    }
    if (resD.ResourceAction[0].ResourceActionPermission[0].isIncluded) {
      this.req.headers["_dependencyResource_Part"] = "isIncluded";
    }
    this.logger.log("request context", this.req.headers);
  }
  async checkForDependentResourceAttribute(params: {
    resourceId: number;
    atb: {
      name: string;
      value: string;
    };
    action: number;
    roleId: number;
  }) {
    const resAttrib = await this.accessControlRepo.getResourceAttributesInfo({
      rescId: params.resourceId,
      atb: params.atb,
      action: params.action,
      roleId: params.roleId,
    });
    this.logger.log(resAttrib, "dependent resource attribute");
    if (resAttrib.ResourceAttributeAction.length > 0) {
      const attrb = resAttrib.ResourceAttributeAction?.[0];
      if (attrb.ResourceAttributeActionPermission.length === 0) {
        throw CommonExceptions.ACCESS_NOT_ALLOWED;
      }
    }
  }
}
