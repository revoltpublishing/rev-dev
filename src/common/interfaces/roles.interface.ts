export interface createResourceParamsI {
  name: string;
  permissions: resourcePermissionI[];
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
