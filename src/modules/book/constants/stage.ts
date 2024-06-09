export const enum BOOK_STAGES_ENUM {
  BOOK_STG_EDTNG = 121,
  BOOK_STG_TYPSTNG,
  BOOK_STG_DESGNG,
  BOOK_STG_REVIEW,
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
  {
    id: BOOK_STAGES_ENUM.BOOK_STG_REVIEW,
    stage: "review",
    prevId: [
      BOOK_STAGES_ENUM.BOOK_STG_EDTNG,
      BOOK_STAGES_ENUM.BOOK_STG_DESGNG,
      BOOK_STAGES_ENUM.BOOK_STG_TYPSTNG,
    ],
  },
];
