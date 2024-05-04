export const ACTION_TYPES: { action: string[] | string; value: number }[] = [
  {
    action: "DELETE",
    value: 3,
  },
  {
    action: ["GET", "READ"],
    value: 0,
  },
  {
    action: ["CREATE", "POST"],
    value: 1,
  },
  {
    action: ["UPDATE", "PATCH", "EDIT"],
    value: 2,
  },
];
