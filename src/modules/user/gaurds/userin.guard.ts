import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class UserResourceIncludeGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const reqContext = request["context"];
    const { _dependencyResource_Part, userDetails } = reqContext;
    if (_dependencyResource_Part) {
      if (_dependencyResource_Part === "isCreated") {
        request.body = {
          ...request.body,
          internalAccessPayload: { createdBy: userDetails.id },
        };
      }
      if (_dependencyResource_Part === "isIncluded") {
        request.body = {
          ...request.body,
          internalAccessPayload: { userId: userDetails.id },
        };
      }
    }
    return true;
  }
}
