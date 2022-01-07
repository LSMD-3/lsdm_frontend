export type UserType = "user" | "admin" | "chef" | "waiter" | "super-admin";

export interface User {
  _id: string;
  email: string;
  name: string;
  surname: string;
  accessToken: string;
  refreshToken: string;
  userType: UserType;
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

export interface MenuRecipes {
  recipe: Recipe;
  price: number;
  max_quantity?: number;
}

export interface Menu {
  name: string;
  description?: string;
  recipes: MenuRecipes[];
  ayce_available: boolean;
}
