import { responseErrorCheck } from "./utils";
import axios from "axios";
import { Menu, Restaurant } from "types";
import { BaseResource } from "./BaseResource";

export interface MenuCreationPreferences {
  totalRecipes: number;
  composition: { category: string; percentage: number }[];
  startPrice: number;
  endPrice: number;
}

class RestaurantApi extends BaseResource<Restaurant> {
  endpoint = "restaurant";

  async addOrder() {
    return axios.post(this.endpoint + "/order/add").then(responseErrorCheck);
  }

  async getMenu(restaurantId: string): Promise<Menu> {
    return axios
      .get(this.endpoint + `/menu/${restaurantId}`)
      .then(responseErrorCheck);
  }

  async createMenu(
    restaurantId: string,
    preferences: MenuCreationPreferences
  ): Promise<Menu> {
    return axios
      .post(this.endpoint + `/menu/${restaurantId}`, preferences)
      .then(responseErrorCheck);
  }

  async searchRestaurantByName(text: string): Promise<Restaurant[]> {
    return axios
      .get(this.endpoint + "/search/" + text)
      .then(responseErrorCheck);
  }
}

export default new RestaurantApi();
