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
