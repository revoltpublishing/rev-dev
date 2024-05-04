import { Injectable, NestMiddleware } from "@nestjs/common";
import { AuthService } from "src/modules/user/services/auth.service";
import { StatusCodes } from "../constants/status";
import { ACTION_TYPES } from "../constants/action";
import { AcessControlService } from "src/modules/user/services/acess-control.service";

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly accessControlService: AcessControlService
  ) {}
  async use(req: Request, res: Response, next: () => void) {
    const accessToken: string = req.headers["authorization"] as string;
    const userDetails = await this.authService.getUserInfoByAccessToken({
      token: accessToken,
    });
    const resc = req.headers["resource"];
    const act = req.headers["action"] || req.method;
    const atb = req.headers["atb"] || null;
    if (!userDetails) {
      throw StatusCodes.INVALID_ACCESS_TOKEN;
    }
    const action = ACTION_TYPES.find((val) => {
      if (typeof val.action == "string") return val.action === act;
      else return val.action.find((v) => v === act);
    });
    if (!action) {
      throw StatusCodes.INVAID_GENERAL;
    }
    // check resource
    const rescInfo = await this.accessControlService.getResourceInfo({
      resc,
      roleId: userDetails.UserRoleMap.Role.id,
      action: action.value,
    });
    if (rescInfo.ResourcePermission.length === 0) {
      throw StatusCodes.ACCESS_NOT_ALLOWED;
    }

    console.log(rescInfo);
    req["context"] = {
      userDetails,
      resc,
      atb,
      rescInfo,
    };
    next();
  }
}
