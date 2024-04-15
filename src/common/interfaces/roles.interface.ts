export interface createResourceParamsI {
  name: string;
  des?: string;
  permission: resourcePermissionI[];
  attribute: resourceAttributeI;
}

export interface resourcePermissionI {
  roleId: number;
  resourceId: number;
  action: number;
}
export interface resourceAttributeI {
  name: string;
  value: string;
  resourceId: number;
  permission: resourceAttributePermissionI[];
}
export interface resourceAttributePermissionI {
  attributeId: number;
  roleId: number;
  action: number;
}

export enum userRoles {
  ROLE_SUPER_ADMIN = 0,
  ROLE_ADMIN = 1,
  ROLE_AUTHOR = 2,
  ROLE_PRODUCT_MANAGER = 3,
  ROLE_EDITOR = 4,
  ROLE_TYPESETTER = 5,
  ROLE_DESGINER = 6,
  ROLE_VIEWER = 7,
}
