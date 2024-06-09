import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { DbStatusCodes } from "../constants/status";
import { HttpException, HttpStatus } from "@nestjs/common";

export const prismaErrorMapper = (e: PrismaClientKnownRequestError) => {
  console.log(e.code, "rrr");
  switch (e.code) {
    case "P2002":
      throw DbStatusCodes.DUPLICATED_FIELD(e.meta.target?.[0]);
    case "P2003":
      console.log(e.meta.target?.[0]);
      switch (e.meta.target?.[0]) {
        default:
          throw new HttpException(
            e.meta.field_name || e.meta.target?.[0],
            HttpStatus.BAD_REQUEST
          );
      }
    default:
      throw new HttpException(e, HttpStatus.NOT_ACCEPTABLE);
  }
};
