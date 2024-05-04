export interface UserI {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  mobileRegion: string;
  roleId: number;
  bookId?: string;
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
export interface filterUserI {
  search: string;
  role: string;
  roleId: number;
  offset: number;
  pg: number;
}
