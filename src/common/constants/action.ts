export const ACTION_TYPES: { action: string[] | string; value: number }[] = [
  {
    action: ["CREATE", "POST", "DELETE"],
    value: 0,
  },
  {
    action: ["GET", "READ", "LIST"],
    value: 1,
  },
  { action: ["EDIT"], value: 2 },
];
