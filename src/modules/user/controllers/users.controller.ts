import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { LoggedInGuard } from "src/common/guards/loggedin.guard";
import { createUserI, filterUserI, UserI } from "../interfaces/user.interface";
import { UsersService } from "../services/users.service";
import { PayloadValidationPipe } from "src/common/pipes/payload.pipe";
import { createUserReqSchema } from "../validationSchema/user";
import { generateRandomPassword } from "src/common/helpers/generatePassword";
import { BookService } from "src/modules/book/services/book.service";
import { MessageError } from "src/common/constants/status";
import { AcessControlService } from "../services/acess-control.service";
import { ImageService } from "src/modules/project/services/image.service";
import { S3Service } from "src/common/services/s3.service";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UsersService,
    private readonly bookService: BookService,
    private readonly accessControlService: AcessControlService,
    private readonly imageService: ImageService,
    private readonly s3Service: S3Service
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
      const roleId = (
        await this.accessControlService.getRoleByRole({ role: body.role })
      ).id;
      body.roleId = roleId;
    }
    try {
      const list = await this.userService.getUsers({ ...body });
      const count = await this.userService.getUsersCount({ ...body });
      // const listRes = list.map(async (usr) => {
      //   if (usr.profileImageId === null) return usr;
      //   const img = await this.imageService.getImageById({
      //     id: usr.profileImageId,
      //   });
      //   const user = { ...usr, signedURL: "" };
      //   const s3Path = img.s3Path;
      //   const mimeType = img.mimeType;
      //   const signedURL = await this.s3Service.getPresignedURL({
      //     path: s3Path,
      //     mimeType,
      //   });
      //   user.signedURL = signedURL;
      //   return user;
      // });
      return { count, list };
    } catch (e) {
      throw new MessageError(e);
    }
  }
}
