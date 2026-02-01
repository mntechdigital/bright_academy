import { JwtPayload } from "jwt-decode";
import { TDepartmentHead } from "./departmentHead.types";

export interface TCustomJwtPayload extends JwtPayload {
  id?: string;
  email: string;
  role: string;
  status: string;
  name: string;
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
  departmentHeads?: TDepartmentHead[];
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


