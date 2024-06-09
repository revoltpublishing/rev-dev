import { Prisma } from "@prisma/client";

export interface bookI {
  title: string;
  description: string;
  bookUsers: string[];
  stage: string;
  createdBy: string;
  stageId: number;
  draftImageId: string;
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
export interface filterBookI {
  search: string;
  stageId: number;
  stage: string;
  offset: number;
  pg: number;
}

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
