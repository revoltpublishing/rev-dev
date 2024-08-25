// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
//   Logger,
// } from "@nestjs/common";
// import { AccessControlRepository } from "src/modules/user/repositories/acessControl.repository";
// import { CommonExceptions } from "../constants/status";
// import {
//   RESOURCE__DATA_TYPE,
//   RESOURCE_ATTRIB_DATA_TYPE,
// } from "src/modules/user/constants/roles";
// import { ResourceAttributeGuard, ResourceGuard } from "./resource.guard";

// @Injectable()
// export class AccessGuard implements CanActivate {
//   constructor(
//     private readonly accessControlRepo: AccessControlRepository,
//     private readonly logger: Logger,
//     private readonly resourceGuard: ResourceGuard,
//     private readonly resourceAccessGuard: ResourceAttributeGuard
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const reqContext = request["context"];
//     const { userDetails, resc, atb, action } = reqContext;
//     try {
//       const rescInfo = await this.accessControlRepo.getResourceInfo({
//         resc,
//         roleId: userDetails.roleId,
//         action: action.value,
//         attribute: atb,
//       });
//       this.logger.log(rescInfo, "Resources of user!");
//       if (
//         atb &&
//         rescInfo.ResourceAttribute?.[0]?.ResourceAttributeAction?.[0]
//           ?.ResourceAttributeActionPermission.length === 0
//       ) {
//         throw CommonExceptions.ACCESS_NOT_ALLOWED;
//       }
//       if (rescInfo.ResourceAction.length === 0) {
//         throw CommonExceptions.ACCESS_NOT_ALLOWED;
//       }
//       if (rescInfo.ResourceAction.length > 0) {
//         if (rescInfo.ResourceAction[0]?.ResourceActionDepend.length > 0) {
//           for (const dp of rescInfo.ResourceAction[0]?.ResourceActionDepend ||
//             []) {
//             reqContext["resourceActionDepend"] = dp;
//             if (dp.type === RESOURCE__DATA_TYPE) {
//               return this.resourceGuard.canActivate(context);
//               // check if the values exists in that resource and provide needed value
//             }
//             if (dp.type === RESOURCE_ATTRIB_DATA_TYPE) {
//               reqContext["rescInfo"] = rescInfo;
//               return this.resourceAccessGuard.canActivate(context);
//               // check if the values exists in that resource
//               // get attrib with resid and name of attrib
//             }
//           }
//         }
//         if (rescInfo.ResourceAction?.[0]?.ResourceActionPermission.length > 0) {
//           const perms =
//             rescInfo.ResourceAction?.[0]?.ResourceActionPermission?.[0];
//           if (perms.isCreated) {
//             request.body = { ...request.body, createdBy: userDetails.id };
//           }
//           if (perms.isIncluded) {
//             request.body = { ...request.body, userId: userDetails.id };
//           }
//         }
//       }
//     } catch (e) {
//       if (e instanceof ForbiddenException) {
//         throw e; // Re-throw ForbiddenException
//       }
//       this.logger.error("Access guard error:", e);
//       throw CommonExceptions.ACCESS_NOT_ALLOWED;
//     }

//     return true;
//   }
// }
