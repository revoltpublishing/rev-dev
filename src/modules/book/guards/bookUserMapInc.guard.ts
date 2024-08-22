import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { BooksRepository } from "../repositories/book.repository";
import { CommonExceptions } from "src/common/constants/status";

@Injectable()
export class BookUserMapIncludeGuard implements CanActivate {
  constructor(private readonly booksRepo: BooksRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessPayload = request.headers["accessPayload"]
      ? JSON.parse(request.headers["accessPayload"])
      : undefined;
    const reqContext = request["context"];
    const { userDetails } = reqContext;
    const { _dependencyResource, _dependencyResource_Part } = reqContext;
    if (
      _dependencyResource === "bookUserMap" &&
      _dependencyResource_Part === "isIncluded"
    ) {
      const { bookId } = accessPayload;
      const bk = await this.booksRepo.getUserBook({
        userId: userDetails.id,
        bookId,
      });
      if (bk) return true;
    }
    throw CommonExceptions.ACCESS_NOT_ALLOWED;
  }
}
