import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AccessControlRepository } from "src/modules/user/repositories/acessControl.repository";
import { CommonExceptions } from "../constants/status";
import { AuthService } from "src/modules/user/services/auth.service";

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken: string = request.headers["authorization"] as string;
    if (!accessToken) {
      throw CommonExceptions.INVALID_ACCESS_TOKEN;
    }
    const userDetails = await this.authService.getUserInfoByAccessToken({
      token: accessToken,
    });
    request["context"] = { userDetails };
    return true;
  }
}
