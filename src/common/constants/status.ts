import { HttpException, HttpStatus } from "@nestjs/common";

export class MessageError extends Error {
  status: number;
  constructor(message) {
    super();
    this.message = message;
  }
}

export class StatusCodes {
  public static readonly INVALID_ACCESS_TOKEN = new HttpException(
    "Access Token is invalid",
    HttpStatus.UNAUTHORIZED
  );
  public static readonly INVAID_GENERAL = new HttpException(
    "Action is invalid",
    HttpStatus.UNAUTHORIZED
  );
  public static readonly ACCESS_NOT_ALLOWED = new HttpException(
    "You are not allowed",
    HttpStatus.NOT_ACCEPTABLE
  );
}
export class DbStatusCodes {
  public static readonly EMAIL_ALREADY_OCCUPIED = new HttpException(
    "email",
    HttpStatus.NOT_ACCEPTABLE
  );
  public static readonly MOBILE_ALREADY_OCCUPIED = new HttpException(
    "mobile",
    HttpStatus.NOT_ACCEPTABLE
  );
  public static readonly ERROR_IN_SAVING_DETAILS = new HttpException(
    "error in saving details",
    HttpStatus.BAD_REQUEST
  );
  public static readonly ROLE_DOESNOT_EXISTS = new HttpException(
    "role doesn't exists",
    HttpStatus.NOT_FOUND
  );
}
