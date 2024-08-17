import {
  ForbiddenException,
  Injectable,
  Logger,
  NestMiddleware,
} from "@nestjs/common";
import { AuthService } from "src/modules/user/services/auth.service";
import { CommonExceptions } from "../constants/status";
import { ACTION_TYPES } from "../constants/action";
import { AccessControlRepository } from "src/modules/user/repositories/acess-control.repository";
import {
  RESOURCE__DATA_TYPE,
  RESOURCE_ATTRIB_DATA_TYPE,
} from "src/modules/user/constants/roles";

@Injectable()
export class AccessMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
    private readonly accessControlRepo: AccessControlRepository
  ) {}
  async use(req: Request, res: Response, next: () => void) {
    this.logger.log("in mid!");
    const reqContext = req["context"];
    try {
      const accessToken: string = req.headers["authorization"] as string;
      if (!accessToken) {
        throw CommonExceptions.INVALID_ACCESS_TOKEN;
      }
      const userDetails = await this.authService.getUserInfoByAccessToken({
        token: accessToken,
      });
      const resc: string = req.headers["resource"];
      const act: string = req.headers["action"] || req.method;
      const atb: {
        name: string;
        value: string;
      } = req.headers["atb"] ? JSON.parse(req.headers["atb"]) : undefined;
      if (!userDetails) {
        throw CommonExceptions.INVALID_ACCESS_TOKEN;
      }
      const action = ACTION_TYPES.find((val) => {
        if (typeof val.action == "string") return val.action === act;
        else return val.action.find((v) => v === act);
      });
      if (!action) {
        throw CommonExceptions.INVAID_GENERAL;
      }
      const rescInfo = await this.accessControlRepo.getResourceInfo({
        resc,
        roleId: userDetails.roleId,
        action: action.value,
        attribute: atb,
      });
      this.logger.log(rescInfo, "Resources of user!");
      if (
        atb &&
        rescInfo.ResourceAttribute?.[0]?.ResourceAttributeAction?.[0]
          ?.ResourceAttributeActionPermission.length === 0
      ) {
        throw CommonExceptions.ACCESS_NOT_ALLOWED;
      }
      if (rescInfo.ResourceAction.length === 0) {
        throw CommonExceptions.ACCESS_NOT_ALLOWED;
      }
      if (rescInfo.ResourceAction.length > 0) {
        if (rescInfo.ResourceAction[0]?.ResourceActionDepend.length > 0) {
          for (const dp of rescInfo.ResourceAction[0]?.ResourceActionDepend ||
            []) {
            if (dp.type === RESOURCE__DATA_TYPE) {
              this.authService.checkForDependentResource({
                name: dp.value,
                action: action.value,
                roleId: userDetails.roleId,
                reqContext: reqContext,
              });
              // return this.resourceGuard.canActivate(context);
              // check if the values exists in that resource and provide needed value
            }
            if (dp.type === RESOURCE_ATTRIB_DATA_TYPE) {
              reqContext["rescInfo"] = rescInfo;
              this.authService.checkForDependentResourceAttribute({
                resourceId: rescInfo.id,
                atb: atb,
                action: action.value,
                roleId: userDetails.roleId,
              });
              // return this.resourceAccessGuard.canActivate(context);
              // check if the values exists in that resource
              // get attrib with resid and name of attrib
            }
          }
        }
        if (rescInfo.ResourceAction?.[0]?.ResourceActionPermission.length > 0) {
          const perms =
            rescInfo.ResourceAction?.[0]?.ResourceActionPermission?.[0];
          if (perms.isCreated) {
            req["context"]["_dependencyResource_Part"] = "isCreated";
          }
          if (perms.isIncluded) {
            req["context"]["_dependencyResource_Part"] = "isIncluded";
          }
        }
      }
      req["context"] = {
        userDetails,
        resc,
        atb,
        action,
      };
    } catch (e) {
      if (e instanceof ForbiddenException) {
        throw e; // Re-throw ForbiddenException
      }
      this.logger.error("Access guard error:", e);
      throw CommonExceptions.ACCESS_NOT_ALLOWED;
    }
    next();
  }
}
