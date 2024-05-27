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
import { UsersRepository } from "../repositories/user.repository";
import { PayloadValidationPipe } from "src/common/pipes/payload.pipe";
import { createUserReqSchema } from "../validationSchema/user";
import { generateRandomPassword } from "src/common/helpers/generatePassword";
import { BooksRepository } from "src/modules/book/repositories/book.repository";
import { MessageError } from "src/common/constants/status";
import { AcessControlRepository } from "../repositories/acess-control.repository";
import { UserService } from "../services/user.service";

@Controller("user")
export class UserController {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly booksRepo: BooksRepository,
    private readonly accessControlRepo: AcessControlRepository,
    private readonly usersService: UserService
  ) {}

  @Post("/add")
  @UsePipes(new PayloadValidationPipe(createUserReqSchema))
  async add(@Body() body: createUserI) {
    const { role, ...rest } = body;
    const roleId = (await this.accessControlRepo.getRoleByRole({ role })).id;
    const password = generateRandomPassword();
    const ud = await this.usersRepo.createUser({
      ...rest,
      password,
      roleId,
    });
    if (body.bookId && typeof ud !== "string") {
      this.booksRepo.addUserToBook({
        bookId: body.bookId,
        userId: ud.id,
      });
    }
    return { message: "created successfully" };
  }
  @Get("/here")
  @UseGuards(LoggedInGuard)
  async here() {
    return "here";
  }
  @Post("/lookup")
  async list(@Body() body: filterUserI) {
    if (body.role) {
      const roleId = (
        await this.accessControlRepo.getRoleByRole({ role: body.role })
      ).id;
      body.roleId = roleId;
    }
    try {
      const list = await this.usersRepo.getUsers({ ...body });
      const count = await this.usersRepo.getUsersCount({ ...body });
      const listRes = await Promise.all(
        list.map((v) => this.usersService.getUserWithImage(v))
      );
      return { count, list: listRes };
    } catch (e) {
      throw new MessageError(e);
    }
  }
}
