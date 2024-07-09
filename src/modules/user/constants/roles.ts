export enum USER_ROLE_CONSTANTS {
  USER_ROLE__S_AD = 990,
  USER_ROLE__AD,
  USER_ROLE__AT,
  USER_ROLE__DS,
  USER_ROLE__PM,
  USER_ROLE__TS,
  USER_ROLE__VW,
}
const USER_ROLE__S_AD = "SUPER_ADMIN";
const USER_ROLE__AD = "ADMIN";
const USER_ROLE__AT = "AUTHOR";
const USER_ROLE__DS = "DESIGNER";
const USER_ROLE__PM = "PROJECT_MANAGER";
const USER_ROLE__TS = "TYPE_SETTER";
const USER_ROLE__VW = "VIEWER";

export const GOD__VIEW_ROLES = [
  USER_ROLE_CONSTANTS.USER_ROLE__AD,
  USER_ROLE_CONSTANTS.USER_ROLE__S_AD,
];

export const USER_ROLE_ARR_MAP = [
  {
    label: USER_ROLE__S_AD,
    value: USER_ROLE_CONSTANTS.USER_ROLE__S_AD,
  },
  {
    label: USER_ROLE__AD,
    value: USER_ROLE_CONSTANTS.USER_ROLE__AD,
  },
  {
    label: USER_ROLE__AT,
    value: USER_ROLE_CONSTANTS.USER_ROLE__AT,
  },
  {
    label: USER_ROLE__DS,
    value: USER_ROLE_CONSTANTS.USER_ROLE__DS,
  },
  {
    label: USER_ROLE__PM,
    value: USER_ROLE_CONSTANTS.USER_ROLE__PM,
  },
  {
    label: USER_ROLE__TS,
    value: USER_ROLE_CONSTANTS.USER_ROLE__TS,
  },
  {
    label: USER_ROLE__VW,
    value: USER_ROLE_CONSTANTS.USER_ROLE__VW,
  },
];
export {
  USER_ROLE__S_AD,
  USER_ROLE__AD,
  USER_ROLE__AT,
  USER_ROLE__DS,
  USER_ROLE__PM,
  USER_ROLE__TS,
};
