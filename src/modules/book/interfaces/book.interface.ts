export interface BookI {
  title: string;
  description: string;
  bookUsers: string[];
  draftId: string;
}

export interface uploadBookDraftI {
  name: string;
  uploadedByUserId: string;
  s3Path: string;
  mimeType: string;
}
