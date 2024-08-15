import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { AccessControlRepository } from "src/modules/user/repositories/acess-control.repository";
import { AuthService } from "src/modules/user/repositories/auth.repository";
import { StatusCodes } from "../constants/status";
import {
  RESOURCE__DATA_TYPE,
  RESOURCE_ATTRIB_DATA_TYPE,
} from "src/modules/user/constants/roles";

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly accessControlRepo: AccessControlRepository,
    private readonly authService: AuthService,
    private readonly logger: Logger
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const reqContext = request["context"];
    const { userDetails, resc, atb, action } = reqContext;
    try {
      const rescInfo = await this.accessControlRepo.getResourceInfo({
        resc,
        roleId: userDetails.roleId,
        action: action.value,
        attribute: atb,
      });
      this.logger.log(
        (await rescInfo).ResourceAction[0]?.ResourceActionDepend,
        "Resources of user!"
      );
      if (rescInfo.ResourceAction.length === 0) {
        throw StatusCodes.ACCESS_NOT_ALLOWED;
      }
      if (rescInfo.ResourceAction.length > 0) {
        for (const dp of rescInfo.ResourceAction[0]?.ResourceActionDepend ||
          []) {
          if (dp.type === RESOURCE__DATA_TYPE) {
            // check if the values exists in that resource and provide needed value
            const resD = await this.accessControlRepo.getResourceDetails({
              name: dp.value,
              action: action.value,
            });
            const resDep = resD.ResourceAction?.[0].ResourceActionDepend;
            const mapp = new Map<string, any>();
            resDep.forEach((dp) => {
              mapp.set(dp.value, request.body[dp.value]);
            });
            const vals = this.accessControlRepo.getDynamicServiceMap({
              resc: dp.value,
              whereBody: { ...Object.fromEntries(mapp) },
            });
            if (vals?.length === 0) throw StatusCodes.ACCESS_NOT_ALLOWED;
          }
          if (dp.type === RESOURCE_ATTRIB_DATA_TYPE) {
            // check if the values exists in that resource
            // get attrib with resid and name of attrib
            const resAttrib =
              await this.accessControlRepo.getResourceAttributesInfo({
                rescId: rescInfo.id,
                atb: {
                  name: dp.value,
                  value: request.body?.[dp.value],
                },
                action: action.value,
                roleId: userDetails.roleId,
              });
            if (resAttrib.ResourceAttributeAction.length > 0) {
              const attrb = resAttrib.ResourceAttributeAction?.[0];
              if (attrb.ResourceAttributeActionPermission.length === 0) {
                throw StatusCodes.ACCESS_NOT_ALLOWED;
              }
            }
          }
        }
      }
    } catch (e) {
      if (e instanceof ForbiddenException) {
        throw e; // Re-throw ForbiddenException
      }
      this.logger.error("Access guard error:", e);
      throw StatusCodes.ACCESS_NOT_ALLOWED;
    }

    return true;
  }
}
