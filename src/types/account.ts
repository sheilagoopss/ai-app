export interface IUser {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAdmin {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
