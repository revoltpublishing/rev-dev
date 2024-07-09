import { Injectable, NestMiddleware } from "@nestjs/common";
import { AuthService } from "src/modules/user/repositories/auth.repository";
import { StatusCodes } from "../constants/status";
import { ACTION_TYPES } from "../constants/action";
import { AccessControlRepository } from "src/modules/user/repositories/acess-control.repository";

@Injectable()
export class AccessMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly accessControlRepo: AccessControlRepository
  ) {}
  async use(req: Request, res: Response, next: () => void) {
    const accessToken: string = req.headers["authorization"] as string;
    const userDetails = await this.authService.getUserInfoByAccessToken({
      token: accessToken,
    });
    // const resc: string = req.headers["resource"];
    // const act: string = req.headers["action"] || req.method;
    // const atb: {
    //   name: string;
    //   value: string;
    // } = req.headers["atb"] || null;
    if (!userDetails) {
      throw StatusCodes.INVALID_ACCESS_TOKEN;
    }
    // const action = ACTION_TYPES.find((val) => {
    //   if (typeof val.action == "string") return val.action === act;
    //   else return val.action.find((v) => v === act);
    // });
    // if (!action) {
    //   throw StatusCodes.INVAID_GENERAL;
    // }
    // // check resource
    // const rescInfo = await this.accessControlRepo.getResourceInfo({
    //   resc,
    //   roleId: userDetails.UserRoleMap.roleId,
    //   action: action.value,
    //   attribute: atb,
    // });
    // if (rescInfo.ResourcePermission.length === 0) {
    //   throw StatusCodes.ACCESS_NOT_ALLOWED;
    // }

    // console.log(rescInfo);
    req["context"] = {
      userDetails,
      // resc,
      // atb,
      // rescInfo,
    };
    next();
  }
}
