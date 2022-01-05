import { responseErrorCheck, SearchParams } from "./utils";
import axios from "axios";
import { Recipe } from "types";

const endpoint = "recipe";

export default class RecipeApi {
  static search(params: SearchParams = {}): Promise<Recipe[]> {
    return axios
      .post(endpoint + "/advancedsearch", params)
      .then(responseErrorCheck);
  }

  static find(recipeId: string): Promise<Recipe> {
    return axios.get(endpoint + `/${recipeId}`).then(responseErrorCheck);
  }

  static count(params = {}): Promise<number> {
    return axios
      .post(endpoint + "/advancedcount", params)
      .then(responseErrorCheck);
  }

  static update(recipe: Recipe): Promise<Recipe> {
    return axios
      .put(endpoint + `/${recipe._id}`, recipe)
      .then(responseErrorCheck);
  }

  static add(recipe: Recipe): Promise<Recipe> {
    return axios.put(endpoint + `/add`, recipe).then(responseErrorCheck);
  }

  static delete(recipe: Recipe): Promise<void> {
    return axios.put(endpoint + `/${recipe._id}`).then(responseErrorCheck);
  }
}
