import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { LoggedInGuard } from "src/common/guards/loggedin.guard";
import { createUserI, filterUserI } from "../interfaces/user.interface";
import { USER_ROLE_ARR_MAP } from "src/common/constants/roles";
import { UsersService } from "../services/users.service";
import { PayloadValidationPipe } from "src/common/pipes/payload.pipe";
import { createUserReqSchema } from "../validationSchema/user";
import { generateRandomPassword } from "src/common/helpers/generatePassword";
import { BookService } from "src/modules/book/services/book.service";
import { MessageError } from "src/common/constants/status";
import { AcessControlService } from "../services/acess-control.service";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UsersService,
    private readonly bookService: BookService,
    private readonly accessControlService: AcessControlService
  ) {}
  @Post("/add")
  @UsePipes(new PayloadValidationPipe(createUserReqSchema))
  async add(@Body() body: createUserI) {
    const { role, ...rest } = body;
    const roleId = (await this.accessControlService.getRoleByRole({ role })).id;
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
  @Post("/lookup")
  async list(@Body() body: filterUserI) {
    if (body.role) {
      const roleId = USER_ROLE_ARR_MAP.find((r) => r.label === body.role);
      body.roleId = roleId.value;
    }
    try {
      const list = await this.userService.getUsers({ ...body });
      const count = await this.userService.getUsersCount({ ...body });
      return { count, list };
    } catch (e) {
      throw new MessageError(e);
    }
  }
}
