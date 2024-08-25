import { Prisma } from "@prisma/client";
import { interAccessPayloadI } from "src/common/interfaces/access.interface";

export interface bookI {
  title: string;
  description: string;
  createdBy: string;
  draftImageId: string;
}
export interface createBookI extends createBookReqI, Prisma.BookCreateInput {}
export interface createBookReqI extends bookI {
  bookUsers: string[];
}
export interface buildCreateBookObjectI extends createBookReqI {
  initBkStg: boolean;
}
export interface uploadImageI {
  id?: string;
  title: string;
  uploadedBy: string;
  s3Path: string;
  mimeType: string;
}
export interface uploadImageParamsI {
  id: string;
}

export interface uploadImageReqI {
  id: string;
  title: string;
  s3Path: string;
  mimeType: string;
}
export interface uploadImageParamsI {
  id: string;
}

export interface uploadImageReqI {
  id: string;
  title: string;
  s3Path: string;
  mimeType: string;
}
export interface filterBookRepoI {
  search: string;
  stageId: number;
  stage: string;
  offset: number;
  pg: number;
  userId: string;
}
export interface filterBookI extends filterBookRepoI {
  internalAccessPayload: interAccessPayloadI;
}

export interface buildFilterBookI
  extends Prisma.BookFindManyArgs,
    filterBookRepoI {}

export type getManyResponse = Prisma.BookUserMapGetPayload<{
  include: {
    User: {
      include: {
        ProfileImage: true;
        UserImageMap: true;
      };
    };
  };
}>;

export interface addBookStageI {
  bookId: string;
  stageId: number;
  stage: string;
  requirements: string;
}
export interface addBookStageReqI {
  bookId: string;
  stage: string;
  requirements: string;
}
export interface updateBookStageI {
  bookId: string;
  stage: string;
  stageId: number;
  isActive?: boolean;
  isAccepted?: boolean;
  isWorking?: boolean;
  isCompleted?: boolean;
  isSubmitted?: boolean;
}
export interface bookUserI {
  bookId: string;
  userId: string;
}
export interface addManuscriptActivityI {
  bkStgManuId: string;
  content: string;
  type: number;
  createdBy: string;
}
export interface updateManuscriptStatusI {
  id: string;
  isSubmitted: boolean;
  isAccepted: boolean;
  isActive: boolean;
}
export interface bookIdStageParamsI {
  id: string;
  stage: string;
}
