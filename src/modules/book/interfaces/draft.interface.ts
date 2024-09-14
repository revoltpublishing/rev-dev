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
export interface addPageContentBodyI {
  page: number;
  content: string;
  imageId?: string;
}
export interface addPageContentParamsI {
  mid: string;
}
export interface addBookManuscriptBodyI {
  bkStgId: string;
  name: string;
  parentId?: string;
  isSubmitted?: boolean;
  imageId?: string;
}
