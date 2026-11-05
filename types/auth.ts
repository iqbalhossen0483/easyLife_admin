import { BaseApiResponse } from "./index";

export interface User {
  id: number;
  name: string;
  address: string;
  phone: string;
  designation: "super_admin" | "admin" | "store_manager" | "sales_man";
  profile: string | null;
  delivered_order: number;
  total_sale: number;
  due_sale: number;
  due_collection: number;
  get_salary: number;
  incentive: number;
  have_money: number;
  debt: number;
  push_token: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Database {
  id: number;
  db_name: string;
  title: string;
  short_title: string;
  max_user: number;
  production: boolean;
  primary_user: number;
  max_product: number;
  max_customer: number;
  current_user: number;
  current_product: number;
  current_customer: number;
  phone: string;
  address: string;
  alt_phone: string;
  owner_name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  database: Database;
}

export type LoginResponse = BaseApiResponse<AuthResponse>;
export type ProfileResponse = BaseApiResponse<AuthResponse>;
export type LogoutResponse = {
  success: boolean;
  message: string;
};

export type LoginPayload = {
  phone: string;
  password: string;
};
