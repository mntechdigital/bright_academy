import { JwtPayload } from "jwt-decode";

export interface TCustomJwtPayload extends JwtPayload {
  id?: string;
  email: string;
  role: string;
  status: string;
  fullName: string;
  profilePhoto?: string;
  iat: number;
  exp: number;
}

export type TRole = {
  id: string;
  name: string;
  isDeleted?: boolean;
  status: "ACTIVE" | "INACTIVE";
  roleFeature?: TRoleFeature[];
  adminUser?: TAdminUser[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type TRoleFeature = {
  id?: string;
  name: string;
  isChecked?: boolean;
  path: string;
  index: number;
  roleId?: string;
};

export type TAdminDetails = {
  id?: string;
  fullName: string;
  email: string;
  isChecked?: boolean;
  password?: string;
  profilePhoto?: string | Blob | undefined;
  roleId: string;
  status?: "ACTIVE" | "INACTIVE";
  createdAt?: Date;
  updatedAt?: Date;
  role: TRole;
};

export type TAdminUser = {
  id: string;
  fullName: string;
  email: string;
  profilePhoto?: string | Blob | undefined;
  roleId: string;
  status?: "ACTIVE" | "INACTIVE";
  createdAt?: Date;
  updatedAt?: Date;
  role: TRole;
};
