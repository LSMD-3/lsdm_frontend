import { Recipe } from "types";
import { BaseResource } from "./BaseResource";

class RecipeApi extends BaseResource<Recipe> {
  endpoint = "recipe";
}

export default new RecipeApi();
