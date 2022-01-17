export type UserType = "user" | "admin" | "chef" | "waiter" | "super-admin";

export interface User {
  _id: string;
  email: string;
  name: string;
  surname: string;
  accessToken: string;
  refreshToken: string;
  userType: UserType;
  joinedTable?: VirtualTable; //Only for users
  joinedRestaurant?: Restaurant; //Only for staff
}

export interface Restaurant {
  _id: string;
  img_url: string;
  descrizione: string;
  tipologia: string;
  nome: string;
  comune: string;
  via: string;
  telefono: string;
  email: string;
  web: string;
  latitudine: string;
  longitudine: string;
  provincia: string;
  cap: string;
  tables_number: number;
  menu: Menu;
}

export interface Recipe {
  _id: string;
  recipe_name: string;
  recipe_link: string;
  image_url?: string;
  ingredients: { name: string; url: string }[];
}

export interface Category {
  category: string;
  totalRecipe: number;
}
export interface Table {
  restaurant_id: string;
  table_id: string;
  customers: string;
}

export interface MenuRecipe {
  _id: string;
  recipe: Recipe;
  price: number;
  max_quantity?: number;
}

export interface Menu {
  name: string;
  description?: string;
  recipes: MenuRecipe[];
  ayce_available: boolean;
}

export interface VirtualTable {
  tableNumber: string;
  restaurant: Restaurant;
}

export type Cart = Record<string, number>;

export type Order = { _id: string; qty: number; note?: string }[];

export interface Item {
  _id: string;
  name: string;
  image_url?: string;
  quantity?: number;
  note?: string;
  liked?: boolean;
}
