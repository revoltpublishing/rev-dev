import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AccessControlRepository } from "src/modules/user/repositories/acessControl.repository";
import { CommonExceptions } from "../constants/status";
import { AuthService } from "src/modules/user/services/auth.service";
import { UsersRepository } from "src/modules/user/repositories/user.repository";

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken: string = request.headers["authorization"] as string;
    if (!accessToken) {
      throw CommonExceptions.INVALID_ACCESS_TOKEN;
    }
    const decodedTkn = this.authService.verifyToken({ token: accessToken });
    const userDetails = await this.usersRepo.getUserById({
      id: decodedTkn["userId"],
    });
    request["context"] = { userDetails };
    return true;
  }
}
