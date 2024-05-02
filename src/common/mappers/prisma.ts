import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { DbStatusCodes } from "../constants/status";

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
    default:
      return "Server Error!";
  }
};
