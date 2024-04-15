import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { AuthService } from "src/modules/user/services/auth.service";
import { StatusCodes } from "../constants/status";

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  use(req: any, res: any, next: () => void) {
    const accessToken: string = req.headers["authorization"] as string;
    const userDetails = this.authService.getUserInfoByAccessToken({
      token: accessToken,
    });
    if (!userDetails) {
      throw new HttpException(
        StatusCodes.ACCESS_TOKEN_INVALID,
        HttpStatus.UNAUTHORIZED
      );
    }
    req["context"] = { userDetails };
    next();
  }
}
