import {
  ForbiddenException,
  Injectable,
  Logger,
  NestMiddleware,
} from "@nestjs/common";
import { AuthService } from "src/modules/user/services/auth.service";
import { CommonExceptions } from "../constants/status";
import { ACTION_TYPES } from "../constants/action";
import { AccessControlRepository } from "src/modules/user/repositories/acessControl.repository";
import {
  RESOURCE__DATA_TYPE,
  RESOURCE_ATTRIB_DATA_TYPE,
} from "src/modules/user/constants/roles";

@Injectable()
export class AccessMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: Logger,
    private readonly authService: AuthService,
    private readonly accessControlRepo: AccessControlRepository
  ) {}
  async use(req: Request, res: Response, next: () => void) {
    this.logger.log("in mid!");
    // flag to put if authorized finally or not and check in interceptor
    req["context"] = {};
    try {
      const accessToken: string = req.headers["authorization"] as string;
      if (!accessToken) {
        throw CommonExceptions.INVALID_ACCESS_TOKEN;
      }
      const userDetails = await this.authService.getUserInfoByAccessToken({
        token: accessToken,
      });
      const resc: string = req.headers["resource"];
      const act = parseInt(req.headers["action"]);
      const atb: {
        name: string;
        value: string;
      } = req.headers["atb"] ? JSON.parse(req.headers["atb"]) : undefined;
      const accessPayload = req.headers["accessPayload"]
        ? JSON.parse(req.headers["accessPayload"])
        : undefined;
      if (!userDetails) {
        throw CommonExceptions.INVALID_ACCESS_TOKEN;
      }
      if (!act || !resc) {
        throw CommonExceptions.INVAID_GENERAL;
      }
      const rescInfo = await this.accessControlRepo.getResourceInfo({
        resc,
        roleId: userDetails.roleId,
        action: act,
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
      if (
        !atb &&
        (rescInfo.ResourceAction.length === 0 ||
          rescInfo.ResourceAction?.[0]?.ResourceActionPermission.length === 0)
      ) {
        throw CommonExceptions.ACCESS_NOT_ALLOWED;
      }
      if (rescInfo.ResourceAction.length > 0) {
        if (rescInfo.ResourceAction[0]?.ResourceActionDepend.length > 0) {
          for (const dp of rescInfo.ResourceAction[0]?.ResourceActionDepend ||
            []) {
            if (dp.type === RESOURCE__DATA_TYPE) {
              req.headers["_dependencyResource"] = dp.value;
              if (
                rescInfo.ResourceAction[0].ResourceActionPermission[0].isCreated
              ) {
                req.headers["_dependencyResource_Part"] = "isCreated";
              }
              if (
                rescInfo.ResourceAction[0].ResourceActionPermission[0]
                  .isIncluded
              ) {
                req.headers["_dependencyResource_Part"] = "isIncluded";
              }
              // return this.resourceGuard.canActivate(context);
              // check if the values exists in that resource and provide needed value
            }
            if (dp.type === RESOURCE_ATTRIB_DATA_TYPE) {
              await this.authService.checkForDependentResourceAttribute({
                resourceId: rescInfo.id,
                atb: {
                  name: dp.value,
                  value: accessPayload?.[dp.value],
                },
                action: act,
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
            req.headers["_dependencyResource_Part"] = "isCreated";
          }
          if (perms.isIncluded) {
            req.headers["_dependencyResource_Part"] = "isIncluded";
          }
        }
        if (
          atb &&
          rescInfo.ResourceAttribute?.[0].ResourceAttributeAction?.[0]
            .ResourceAttributeActionPermission.length > 0
        ) {
          const perms =
            rescInfo.ResourceAttribute?.[0].ResourceAttributeAction?.[0]
              .ResourceAttributeActionPermission[0];
          if (perms.isCreated) {
            req.headers["_dependencyResource_Part"] = "isCreated";
          }
          if (perms.isIncluded) {
            req.headers["_dependencyResource_Part"] = "isIncluded";
          }
        }
      }
      req["context"] = {
        userDetails,
        resc,
        atb,
        act,
      };
    } catch (e) {
      if (e instanceof ForbiddenException) {
        throw e; // Re-throw ForbiddenException
      }
      this.logger.error("Middleware ERROR:", e);
      throw CommonExceptions.ACCESS_NOT_ALLOWED;
    }
    next();
  }
}
