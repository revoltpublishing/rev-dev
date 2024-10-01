export const enum BOOK_STAGES_ENUM {
  BOOK_STG_EDTNG = 121,
  BOOK_STG_TYPSTNG,
  BOOK_STG_DESGNG,
  BOOK_STG_REVIEW,
}

export const BOOK_STAGE_TREE = [
  {
    id: BOOK_STAGES_ENUM.BOOK_STG_EDTNG,
    stage: "EDITING",
    prevId: null,
  },
  {
    id: BOOK_STAGES_ENUM.BOOK_STG_DESGNG,
    stage: "DESIGNING",
    prevId: null,
  },
  {
    id: BOOK_STAGES_ENUM.BOOK_STG_TYPSTNG,
    stage: "TYPESETTING",
    prevId: [BOOK_STAGES_ENUM.BOOK_STG_EDTNG],
  },
  {
    id: BOOK_STAGES_ENUM.BOOK_STG_REVIEW,
    stage: "REVIEW",
    prevId: [
      BOOK_STAGES_ENUM.BOOK_STG_EDTNG,
      BOOK_STAGES_ENUM.BOOK_STG_DESGNG,
      BOOK_STAGES_ENUM.BOOK_STG_TYPSTNG,
    ],
  },
];
