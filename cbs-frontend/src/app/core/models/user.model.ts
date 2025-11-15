export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  roles: Role[];
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  resource: string;
  action: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
