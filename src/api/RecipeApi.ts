import axios from "axios";
import { Category, Recipe } from "types";
import { BaseResource } from "./BaseResource";
import { responseErrorCheck } from "./utils";

class RecipeApi extends BaseResource<Recipe> {
  endpoint = "recipe";

  async getCategories(): Promise<Category[]> {
    return axios.get(this.endpoint + `/categories`).then(responseErrorCheck);
  }

  async sample(limit: number): Promise<Recipe[]> {
    return axios
      .get(this.endpoint + `/sample/${limit}`)
      .then(responseErrorCheck);
  }

  async getRecipesByIds(recipeIds: string[]): Promise<Recipe[]> {
    return axios
      .post(this.endpoint + "/getrecipebyid", { recipeIds })
      .then(responseErrorCheck);
  }

  async getRecipesByIngredient(ingredient: string): Promise<any> {
    return axios
      .get(this.endpoint + "/byIngredient/" + ingredient)
      .then(responseErrorCheck);
  }
}

export default new RecipeApi();
