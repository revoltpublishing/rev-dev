import { interAccessPayloadI } from "src/common/interfaces/access.interface";

export interface UserI {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  mobileRegion: string;
  roleId: number;
  accessToken: string;
  bookId?: string;
  s3Url?: string;
  createdBy?: string;
}

export interface updateUserI {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  password?: string;
  mobileRegion?: string;
  accessToken?: string;
  profileImageId?: string;
}

export interface createUserI {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  mobileRegion: string;
  role: string;
  roleId: number;
  bookId?: string;
}
export interface filterUserI extends filterUserRepoI {
  internalAccessPayload?: interAccessPayloadI;
}
export interface filterUserRepoI {
  search: string;
  role: string;
  roleId: number;
  offset: number;
  pg: number;
  createdBy: string;
}
