import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from "@nestjs/common";
import { AccessControlRepository } from "src/modules/user/repositories/acess-control.repository";
import { CommonExceptions } from "../constants/status";

@Injectable()
export class ResourceGuard implements CanActivate {
  constructor(
    private readonly accessControlRepo: AccessControlRepository,
    private readonly logger: Logger
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const reqContext = request["context"];
    const { userDetails, action, resourceActionDepend } = reqContext;

    const resD = await this.accessControlRepo.getResourceDetails({
      name: resourceActionDepend.value,
      action: action.value,
      roleId: userDetails.roleId,
    });
    reqContext["_dependencyResource"] = resourceActionDepend.value;
    if (resD.ResourceAction[0].ResourceActionPermission[0].isCreated) {
      reqContext["_dependencyResource_Part"] = "isCreated";
    }
    if (resD.ResourceAction[0].ResourceActionPermission[0].isIncluded) {
      reqContext["_dependencyResource_Part"] = "isIncluded";
    }
    this.logger.log("request context", reqContext);
    // const resDep = resD.ResourceAction?.[0].ResourceActionDepend;
    // const mapp = new Map<string, any>();
    // resDep.forEach((dp) => {
    //   mapp.set(dp.value, request.body[dp.value]);
    // });
    // const vals = this.accessControlRepo.getDynamicServiceMap({
    //   resc: resourceActionDepend.value,
    //   whereBody: { ...Object.fromEntries(mapp) },
    // });
    // if (vals?.length === 0) throw CommonExceptions.ACCESS_NOT_ALLOWED;
    return true;
  }
}

@Injectable()
export class ResourceAttributeGuard implements CanActivate {
  constructor(
    private readonly accessControlRepo: AccessControlRepository,
    private readonly logger: Logger
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const reqContext = request["context"];
    const { userDetails, action, resourceActionDepend, rescInfo } = reqContext;
    const resAttrib = await this.accessControlRepo.getResourceAttributesInfo({
      rescId: rescInfo.id,
      atb: {
        name: resourceActionDepend.value,
        value: request.body?.[resourceActionDepend.value],
      },
      action: action.value,
      roleId: userDetails.roleId,
    });
    if (resAttrib.ResourceAttributeAction.length > 0) {
      const attrb = resAttrib.ResourceAttributeAction?.[0];
      if (attrb.ResourceAttributeActionPermission.length === 0) {
        throw CommonExceptions.ACCESS_NOT_ALLOWED;
      }
    }
    return true;
  }
}
