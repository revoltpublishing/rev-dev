import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { DbStatusCodes } from "../constants/status";
import { HttpException, HttpStatus } from "@nestjs/common";

export const prismaErrorMapper = (e: PrismaClientKnownRequestError) => {
  const target = e.meta.target?.[0] as string;
  switch (e.code) {
    case "P2002":
      switch (target) {
        case "email":
          throw DbStatusCodes.EMAIL_ALREADY_OCCUPIED;
        case "mobile":
          throw DbStatusCodes.MOBILE_ALREADY_OCCUPIED;
      }
    case "P2003":
      console.log(target);
      switch (target) {
        default:
          throw new HttpException(
            e.meta.field_name || target,
            HttpStatus.BAD_REQUEST
          );
      }
    default:
      throw new HttpException(e, HttpStatus.NOT_ACCEPTABLE);
  }
};
