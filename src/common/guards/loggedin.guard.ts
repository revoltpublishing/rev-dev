import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AcessControlService } from "src/modules/user/services/acess-control.service";

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private readonly accessControlService: AcessControlService) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const reqContext = request["context"];
    const { userDetails, resc, atb, rescInfo } = reqContext;

    return true;
  }
}
