export type AccountNameType =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "RECEPTION"
  | "MACHINE_OPERATOR"
  | "DRIVER";

export interface AccountTypes {
  id: string;
  name: AccountNameType;
}

export interface UsersTypes {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  accountTypes: AccountTypes;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserQueryTypes {
  page?: number;
  limit?: number;
  active?: boolean | string;
  userType?: string;
}

export interface UserResponseTypes {
  data: UsersTypes[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
