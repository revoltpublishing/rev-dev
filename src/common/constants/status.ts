import { ForbiddenException, HttpException, HttpStatus } from "@nestjs/common";

export class MessageError extends Error {
  status: number;
  constructor(e) {
    super();
    this.status = e.status;
    this.message = e.message;
  }
}

export class CommonExceptions {
  public static readonly INVALID_ACCESS_TOKEN = new HttpException(
    "Access Token is invalid",
    HttpStatus.UNAUTHORIZED
  );
  public static readonly INVAID_GENERAL = new HttpException(
    "Action is invalid",
    HttpStatus.UNAUTHORIZED
  );
  public static readonly ACCESS_NOT_ALLOWED = new ForbiddenException(
    "You are not allowed to perform this action"
  );
  public static readonly INVALID_BOOK_STAGE_REDIRECTION = new HttpException(
    "Book can't move to the provided state, as it has dependency on some other stages",
    HttpStatus.NOT_ACCEPTABLE
  );
  public static readonly MISSING_FIELD = (args: string) =>
    new HttpException(
      `${args} type of value is missing`,
      HttpStatus.NOT_ACCEPTABLE
    );
  public static readonly INVALID_CREDENTIALS = (args: string) =>
    new HttpException(`${args} is invalid`, HttpStatus.NOT_ACCEPTABLE);
}
export class DbStatusCodes {
  public static readonly MOBILE_ALREADY_OCCUPIED = {
    message: "mobile should be unique",
    status: HttpStatus.NOT_ACCEPTABLE,
  };
  public static readonly ERROR_IN_SAVING_DETAILS = {
    message: "error in saving details",
    status: HttpStatus.BAD_REQUEST,
  };
  public static readonly ROLE_DOESNOT_EXISTS = {
    message: "role doesn't exist",
    status: HttpStatus.NOT_FOUND,
  };
}
export class DbExecptions {
  public static readonly DOESNOT_EXISTS = (str: string) =>
    new HttpException(`${str} doesn't exists`, HttpStatus.EXPECTATION_FAILED);
  public static readonly DUPLICATED_FIELD = (str: string) =>
    new HttpException(
      `${str} field value already exists.`,
      HttpStatus.NOT_ACCEPTABLE
    );
}

export class DynamicStatusCodes {
  public static readonly INVAID_DOCUMENT_FORMAT = (args: string) =>
    new HttpException(
      `This type of format of document is not allowed, please provide in formats: ${args}`,
      HttpStatus.NOT_ACCEPTABLE
    );
}
