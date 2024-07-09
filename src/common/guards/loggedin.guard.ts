import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AccessControlRepository } from "src/modules/user/repositories/acess-control.repository";

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private readonly accessControlRepo: AccessControlRepository) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const reqContext = request["context"];
    const { userDetails, resc, atb, rescInfo } = reqContext;

    return true;
  }
}
