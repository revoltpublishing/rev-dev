export interface createResourceParamsI {
  name: string;
  permissions: resourcePermissionI[];
  actions: resourceActionI[];
}
export interface resourceActionI {
  action: number;
  depends: {
    name: string;
    type: string;
  }[];
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
  permissions: resourceAttributePermissionI[];
}
export interface resourceAttributePermissionI {
  attributeId: number;
  roleId: number;
  action: number;
}
// 0-c, 1-r, 2-u, 3-d
