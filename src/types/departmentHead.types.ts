import { TRole } from "./atuh.interface";


export type TDepartmentHead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  xUrl?: string;
  password: string;
  roleId: string;
  role: TRole;
  profilePhoto?: string;
  createdAt: string;
  updatedAt: string;
};
