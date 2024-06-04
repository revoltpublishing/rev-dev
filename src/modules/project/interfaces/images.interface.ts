export interface uploadBookStageImageI {
  bookId: string;
  stageId: number;
  uploadedBy: string;
  name: string;
  s3Path: string;
  mimeType: string;
}

export interface uploadImageReqI {
  name: string;
  s3Path: string;
  mimeType: string;
}
