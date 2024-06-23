export interface createResourceParamsI {
  name: string;
  des?: string;
  permission: resourcePermissionI[];
}

export interface resourcePermissionI {
  roleId: number;
  resourceId: number;
  action: number;
}
export interface resourceAttributeI {
  name: string;
  value: string;
  type: string;
  resourceId: number;
  permission: resourceAttributePermissionI[];
}
export interface resourceAttributePermissionI {
  attributeId: number;
  roleId: number;
  action: number;
}
