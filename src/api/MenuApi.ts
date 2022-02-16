import { responseErrorCheck } from "./utils";
import axios from "axios";
import { Restaurant, RestaurantNameId, MenuRecipe } from "types";
import { BaseResource } from "./BaseResource";

interface Menu {
  ayce: boolean;
  name: string;
  price?: number;
  recipes: MenuRecipe[];
}

export interface MenuCreationPreferences {
  totalRecipes: number;
  composition: { category: string; percentage: number }[];
  startPrice: number;
  endPrice: number;
}

class MenuApi extends BaseResource<Restaurant> {
  endpoint = "menu";

  async createMenu(restaurantId: string, menu: Menu) {
    return axios
      .post(this.endpoint + "/create", { restaurantId, menu })
      .then(responseErrorCheck);
  }

  async deleteMenu(restaurantId: string, menuIndex: number) {
    return axios
      .post(this.endpoint + "/deleteMenu", { restaurantId, menuIndex })
      .then(responseErrorCheck);
  }

  async createRandomMenu(
    restaurantId: string,
    preferences: MenuCreationPreferences
  ): Promise<Menu> {
    return axios
      .post(this.endpoint + `/randommenu/${restaurantId}`, preferences)
      .then(responseErrorCheck);
  }

  async addRecipeToMenu(
    restaurantId: string,
    menuIndex: number,
    recipe: MenuRecipe
  ) {
    return axios
      .post(this.endpoint + "/addRecipeToMenu", {
        restaurantId,
        menuIndex,
        recipe,
      })
      .then(responseErrorCheck);
  }

  async addRecipesToMenu(
    restaurantId: string,
    menuIndex: number,
    recipes: MenuRecipe[]
  ) {
    return axios
      .post(this.endpoint + "/addRecipesToMenu", {
        restaurantId,
        menuIndex,
        recipes,
      })
      .then(responseErrorCheck);
  }

  async removeRecipesFromMenu(
    restaurantId: string,
    menuIndex: number,
    recipeId: string[]
  ) {
    return axios
      .post(this.endpoint + "/removeRecipesFromMenu", {
        restaurantId,
        menuIndex,
        recipeId,
      })
      .then(responseErrorCheck);
  }
}

export default new MenuApi();
