import { Prisma } from "@prisma/client";

export interface createResourceParamsI {
  name: string;
  action?: resourceActionI;
}
export interface resourceActionI {
  action: number;
  depends: resourceActionDependI[];
  permissions: resourcePermissionI[];
}

export interface createResourceActionI extends resourceActionI {
  resourceId: number;
}

export interface resourceAttributeActionI {
  action: number;
  depends: resourceActionDependI[];
  permissions: resourceAttributePermissionI[];
}

export interface resourceActionDependI {
  type: string;
  value: string;
  resourceActionId: number;
}

export interface resourcePermissionI {
  roleId: number;
  resourceActionId: number;
}
export interface resourceAttributeI {
  name: string;
  value: string;
  resourceId: number;
  action: resourceActionI;
}
export interface resourceAttributePermissionI {
  attributeId: number;
  roleId: number;
  action: number;
}
// 0-c, 1-r, 2-u, 3-d
export interface resourceAttributeBodyI {
  name: string;
  value: string;
  resourceId: number;
  action: number;
}
export interface resourceAttributePermissionsBodyI {
  name: string;
  action: number;
  atb?: resourceAttributeBodyI;
}

export type ResourceInfoResponse = Promise<{
  id: number; // Assuming Resource has an id
  name: string; // Assuming Resource has a name
  ResourceAction?: Array<{
    action: number; // Assuming action is a number
    ResourceActionPermission?: Prisma.ResourceActionPermissionGetPayload<{}>;
    ResourceActionDepend?: Array<{
      // fields for ResourceActionDepend...
    }>;
  }>;
  ResourceAttribute?: Array<{
    name: string; // Assuming ResourceAttribute has a name
    value: string; // Assuming ResourceAttribute has a value
    ResourceAttributeAction?: Array<{
      action: number; // Assuming action is a number
      ResourceAttributeActionPermission?: Array<{
        roleId: number; // Assuming roleId is a number
        // other permission fields...
      }>;
      ResourceAttributeActionDepend?: Array<{
        // fields for ResourceAttributeActionDepend...
      }>;
    }>;
  }>;
}>;
