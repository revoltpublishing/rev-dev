export enum USER_ROLE_CONSTANTS {
  USER_ROLE__S_AD = 990,
  USER_ROLE__AD,
  USER_ROLE__AT,
  USER_ROLE__DS,
  USER_ROLE__PM,
  USER_ROLE__TS,
  USER_ROLE__VW,
}
export const USER_ROLE_ARR_MAP = [
  {
    label: "SUPER_ADMIN",
    value: USER_ROLE_CONSTANTS.USER_ROLE__S_AD,
  },
  {
    label: "ADMIN",
    value: USER_ROLE_CONSTANTS.USER_ROLE__AD,
  },
  {
    label: "AUTHOR",
    value: USER_ROLE_CONSTANTS.USER_ROLE__AT,
  },
  {
    label: "DESIGNER",
    value: USER_ROLE_CONSTANTS.USER_ROLE__DS,
  },
  {
    label: "PROJECT_MANAGER",
    value: USER_ROLE_CONSTANTS.USER_ROLE__PM,
  },
  {
    label: "TYPE_SETTER",
    value: USER_ROLE_CONSTANTS.USER_ROLE__TS,
  },
  {
    label: "VIEWER",
    value: USER_ROLE_CONSTANTS.USER_ROLE__VW,
  },
];
