import {
  Body,
  Controller,
  Get,
  Post,
  Response,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { LoggedInGuard } from "src/common/guards/loggedin.guard";
import { createUserI, UserI } from "../interfaces/user.interface";
import { USER_ROLE_ARR_MAP } from "src/common/constants/roles";
import { UsersService } from "../services/users.service";
import { PayloadValidationPipe } from "src/common/pipes/payload.pipe";
import { createUserReqSchema } from "../validationSchema/user";
import { generateRandomPassword } from "src/common/helpers/generatePassword";
import { BookService } from "src/modules/book/services/book.service";

@Controller("users")
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly bookService: BookService
  ) {}
  @Post("/")
  @UsePipes(new PayloadValidationPipe(createUserReqSchema))
  async add(@Body() body: createUserI) {
    const { role, ...rest } = body;
    const roleId = USER_ROLE_ARR_MAP.find((val) => val.label === role).value;
    const password = generateRandomPassword();
    const ud = await this.userService.createUser({
      ...rest,
      password,
      roleId,
    });
    if (body.bookId && typeof ud !== "string") {
      this.bookService.addUserToBook({
        bookId: body.bookId,
        userId: ud.id,
      });
    }
    return { message: "created successfully" };
  }
  @Get("/here")
  @UseGuards(LoggedInGuard)
  async here() {
    return "pspsps";
  }
}
