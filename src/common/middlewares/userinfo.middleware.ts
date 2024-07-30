import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { AuthService } from "src/modules/user/repositories/auth.repository";
import { StatusCodes } from "../constants/status";
import { ACTION_TYPES } from "../constants/action";
import { AccessControlRepository } from "src/modules/user/repositories/acess-control.repository";

@Injectable()
export class AccessMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly accessControlRepo: AccessControlRepository,
    private readonly logger: Logger
  ) {}
  async use(req: Request, res: Response, next: () => void) {
    this.logger.log("in mid!");
    const accessToken: string = req.headers["authorization"] as string;
    const userDetails = await this.authService.getUserInfoByAccessToken({
      token: accessToken,
    });
    const resc: string = req.headers["resource"];
    const act: string = req.method;
    const atb: {
      name: string;
      value: string;
    } = req.headers["atb"] || undefined;
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
    // // check resource
    const rescInfo = await this.accessControlRepo.getResourceInfo({
      resc,
      roleId: userDetails.roleId,
      action: action.value,
      attribute: atb,
    });
    this.logger.log(rescInfo, "Resources of user!");
    if (rescInfo.ResourcePermission.length === 0) {
      throw StatusCodes.ACCESS_NOT_ALLOWED;
    }
    if (rescInfo.ResourceAction.length > 0) {
      rescInfo.ResourceAction[0]?.depends.forEach(async (dp) => {
        if (dp["type"] === "resc") {
          // check if the values exists in that resource and provide needed value
          dp["name"];
          const resD = await this.accessControlRepo.getResourceDetails({
            name: dp["name"],
            action: action.value,
          });
          const resDep = resD.ResourceAction[0]?.depends;
          const mapp = new Map<string, any>();
          resDep.forEach((dp) => {
            mapp.set(dp, req.body[dp]);
          });
          const vals = this.accessControlRepo.getDynamicServiceMap({
            resc: dp["name"],
            whereBody: { ...Object.fromEntries(mapp) },
          });
          if (vals?.length === 0) throw StatusCodes.ACCESS_NOT_ALLOWED;
        }
        if (dp["type"] === "attrb") {
          // check if the values exists in that resource
          // get attrib with resid and name of attrib
          const resAttrib =
            await this.accessControlRepo.getResourceAttributebInfo({
              rescId: rescInfo.id,
              atb: {
                name: dp["name"],
                value: req.body?.[dp["name"]],
              },
              action: action.value,
              roleId: userDetails.roleId,
            });
          if (resAttrib.length === 0) throw StatusCodes.ACCESS_NOT_ALLOWED;
        }
      });
    }
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
