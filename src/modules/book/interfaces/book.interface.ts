import { Prisma } from "@prisma/client";

export interface BookI {
  title: string;
  description: string;
  bookUsers: string[];
  stage: string;
  stageId: number;
  draftId: string;
}

export interface uploadImageI {
  id?: string;
  title: string;
  uploadedBy: string;
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
