import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AccessGuard } from "src/common/guards/access.guard";
import { createUserI, filterUserI } from "../interfaces/user.interface";
import { UsersRepository } from "../repositories/user.repository";
import { PayloadValidationPipe } from "src/common/pipes/payload.pipe";
import { createUserReqSchema } from "../validationSchema/user";
import { generateRandomPassword } from "src/common/helpers/generatePassword";
import { BooksRepository } from "src/modules/book/repositories/book.repository";
import { DbExecptions, MessageError } from "src/common/constants/status";
import { AccessControlRepository } from "../repositories/acess-control.repository";
import { UserService } from "../services/user.service";
import { User } from "@prisma/client";

@Controller("users")
export class UserController {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly booksRepo: BooksRepository,
    private readonly accessControlRepo: AccessControlRepository,
    private readonly usersService: UserService
  ) {}

  @Post("/add")
  @UseGuards(AccessGuard)
  @UsePipes(new PayloadValidationPipe(createUserReqSchema))
  async add(@Body() body: createUserI) {
    const { role, ...rest } = body;
    const roleD = await this.accessControlRepo.getRoleInfoByRole({ role });
    const password = generateRandomPassword();
    if (!roleD) {
      throw DbExecptions.DOESNOT_EXISTS("role");
    }
    const ud = await this.usersRepo.createUser({
      ...rest,
      password,
      roleId: roleD.id,
    });
    if (body.bookId && typeof ud !== "string") {
      this.booksRepo.addUserToBook({
        bookId: body.bookId,
        userId: ud.id,
      });
    }
    ud.password = "";
    return { message: "created successfully", user: ud };
  }
  @Get("/here")
  @UseGuards(AccessGuard)
  async here() {
    return "here";
  }
  @Post("/lookup")
  async list(@Body() body: filterUserI) {
    let list: User[];
    let count: number;
    if (body.role) {
      const roleId = (
        await this.accessControlRepo.getRoleInfoByRole({ role: body.role })
      ).id;
      body.roleId = roleId;
    }
    try {
      Promise.all([
        (list = await this.usersRepo.getUsers({ ...body })),
        (count = await this.usersRepo.getUsersCount({ ...body })),
      ]);
      const listRes = await Promise.all(
        list.map((v) => this.usersService.getUserWithImage({ user: v }))
      );
      const res = await Promise.all(
        listRes.map(async (v) => {
          const role = await this.accessControlRepo.getRoleInfoById({
            id: v.roleId,
          });
          const bkLst = await this.booksRepo.getUserBooks({ userId: v.id });
          return {
            ...v,
            role: role.role,
            recentBook: bkLst?.[0],
            bookCount: bkLst.length,
          };
        })
      );
      return { count, list: res };
    } catch (e) {
      throw new MessageError(e);
    }
  }
}
