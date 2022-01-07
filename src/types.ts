export interface User {
  _id: string;
  email: string;
  name: string;
  surname: string;
  accessToken: string;
  refreshToken: string;
  master: boolean;
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
