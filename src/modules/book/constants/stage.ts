export const enum BOOK_STAGES_ENUM {
  BOOK_STG_EDTNG = 121,
  BOOK_STG_TYPSTNG,
  BOOK_STG_DESGNG,
}

export const BOOK_STAGE_TREE = [
  {
    id: BOOK_STAGES_ENUM.BOOK_STG_EDTNG,
    stage: "editing",
    prevId: null,
  },
  {
    id: BOOK_STAGES_ENUM.BOOK_STG_DESGNG,
    stage: "designing",
    prevId: null,
  },
  {
    id: BOOK_STAGES_ENUM.BOOK_STG_TYPSTNG,
    stage: "typesetting",
    prevId: [BOOK_STAGES_ENUM.BOOK_STG_EDTNG],
  },
];
