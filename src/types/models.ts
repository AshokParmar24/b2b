export enum UserRole {
  ADMIN = 1,
  USER = 2,
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Admin",
  [UserRole.USER]: "User",
};

export type RoleType = UserRole.ADMIN | UserRole.USER;

export interface HsnEntry {
  code: string;
  description: string;
  productName: string;
  unit: string;
}

export interface Business {
  _id?: any;
  businessName: string;
  ownerName: string;
  mobiles: string[];
  whatsapp: string;
  email: string;
  website: string;
  address: string;
  countryId: any;
  stateId: any;
  cityId: any;
  pincodeId: any;
  gstNumber: string;
  logoUrl: string;
  cardImages: string[];
  hsnCodes: HsnEntry[];
  slug: string;
  userId: any;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Plan {
  _id?: any;
  name: string;
  description: string;
  price: number;
  maxListings: number;
  maxImages: number;
  maxHsnCodes: number | null;
  features: string[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Country {
  _id?: any;
  name: string;
  code: string;
  flag: string;
  phoneCode: string;
  currencyCode: string;
  currencySymbol: string;
  countryLogo: string;
  isActive: boolean;
}

export interface State {
  _id?: any;
  name: string;
  countryId: any;
  code: string;
  isActive: boolean;
}

export interface City {
  _id?: any;
  name: string;
  stateId: any;
  isActive: boolean;
}

export interface Pincode {
  _id?: any;
  pincode: string;
  cityId: any;
  area: string;
  isActive: boolean;
}

export interface HsnCode {
  _id?: any;
  code: string;
  description: string;
  unit: string;
  isActive: boolean;
}

export interface User {
  _id?: any;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  mobileCode?: string;
  mobileIso?: string;
  countryId?: any;
  stateId?: any;
  cityId?: any;
  pincodeId?: any;
  role: UserRole;
  planId?: any;
  planStartDate?: Date | null;
  planEndDate?: Date | null;
  isActive?: boolean;
  dataCredits?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
