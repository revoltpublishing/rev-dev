export interface BookI {
  title: string;
  description: string;
  bookUsers: string[];
  stage: string;
  stageId: number;
  draftId: string;
}

export interface uploadBookDraftI {
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
