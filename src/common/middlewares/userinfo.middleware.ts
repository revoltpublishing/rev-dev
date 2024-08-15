import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { AuthService } from "src/modules/user/repositories/auth.repository";
import { DbExecptions, DbStatusCodes, StatusCodes } from "../constants/status";
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
    if (!accessToken) {
      throw StatusCodes.INVALID_ACCESS_TOKEN;
    }
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
    // const rescInfo = await this.accessControlRepo.getResourceInfo({
    //   resc,
    //   roleId: userDetails.roleId,
    //   action: action.value,
    //   attribute: atb,
    // });
    // this.logger.log(
    //   rescInfo.ResourceAction[0]?.ResourceActionDepend,
    //   "Resources of user!"
    // );
    // if (rescInfo.ResourceAction.length === 0) {
    //   error.message = "You are not allowed to perform this action";
    //   error.status = HttpStatus.NOT_FOUND;
    //   error.allowed = false;
    //   req["context"].resourceError = error;
    // }
    // if (rescInfo.ResourceAction.length > 0) {
    //   rescInfo.ResourceAction[0]?.ResourceActionDepend.forEach(async (dp) => {
    //     if (dp.type === RESOURCE__DATA_TYPE) {
    //       // check if the values exists in that resource and provide needed value
    //       const resD = await this.accessControlRepo.getResourceDetails({
    //         name: dp.value,
    //         action: action.value,
    //       });
    //       const resDep = resD.ResourceAction?.[0].ResourceActionDepend;
    //       const mapp = new Map<string, any>();
    //       resDep.forEach((dp) => {
    //         mapp.set(dp.value, req.body[dp.value]);
    //       });
    //       const vals = this.accessControlRepo.getDynamicServiceMap({
    //         resc: dp.value,
    //         whereBody: { ...Object.fromEntries(mapp) },
    //       });
    //       if (vals?.length === 0) {
    //         error.message = "You are not allowed to perform this action";
    //         error.status = HttpStatus.NOT_FOUND;
    //         error.allowed = false;
    //         req["context"].resourceError = error;
    //         // next();
    //       }
    //     }
    //     if (dp.type === RESOURCE_ATTRIB_DATA_TYPE) {
    //       // check if the values exists in that resource
    //       // get attrib with resid and name of attrib
    //       const resAttrib =
    //         await this.accessControlRepo.getResourceAttributesInfo({
    //           rescId: rescInfo.id,
    //           atb: {
    //             name: dp.value,
    //             value: req.body?.[dp.value],
    //           },
    //           action: action.value,
    //           roleId: userDetails.roleId,
    //         });
    //       if (resAttrib.ResourceAttributeAction.length > 0) {
    //         const attrb = resAttrib.ResourceAttributeAction?.[0];
    //         if (attrb.ResourceAttributeActionPermission.length === 0) {
    //           console.log("rnrnrnrn");
    //           error.message = "You are not allowed to perform this action";
    //           error.status = HttpStatus.NOT_FOUND;
    //           req["context"].resourceError = error;
    //           // next();
    //         }
    //       }
    //     }
    //   });
    // }

    // console.log(rescInfo);
    req["context"] = {
      userDetails,
      resc,
      atb,
      action,
      // rescInfo,
    };
    next();
  }
}
