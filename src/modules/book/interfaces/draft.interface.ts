export interface addBookDraftPageCharacterI {
  bookId: string;
  pageNo: number;
  character: string;
  prevId: string | null;
}

export interface addBookDraftPageI {
  page: number;
  content: string;
  bkStgManuId: string;
}
