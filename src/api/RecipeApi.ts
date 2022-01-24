import axios from "axios";
import { Category, Recipe } from "types";
import { BaseResource } from "./BaseResource";
import { responseErrorCheck } from "./utils";

class RecipeApi extends BaseResource<Recipe> {
  endpoint = "recipe";

  async getCategories(): Promise<Category[]> {
    return axios.get(this.endpoint + `/categories`).then(responseErrorCheck);
  }

  async getRecipesByIds(recipeIds: string[]): Promise<Recipe[]> {
    return axios
      .post(this.endpoint + "/getrecipebyid", { recipeIds })
      .then(responseErrorCheck);
  }
}

export default new RecipeApi();
