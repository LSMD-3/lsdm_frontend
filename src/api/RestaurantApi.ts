import { responseErrorCheck } from "./utils";
import axios from "axios";
import { Menu, Restaurant, UserType } from "types";
import { BaseResource } from "./BaseResource";
import { RestaurantNameId } from "./Neo4jApi";

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

  async addStaffMember(
    restaurantId: string,
    userId: string,
    userType: UserType
  ) {
    return axios
      .post(this.endpoint + "/staff", { restaurantId, userId, userType })
      .then(responseErrorCheck);
  }

  async findRestaurantOfStaff(
    userId: string,
    userType: UserType
  ): Promise<Restaurant> {
    return axios
      .get(this.endpoint + `/staff/${userId}/${userType}`)
      .then(responseErrorCheck);
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

  async findRestaurantByIds(
    restaurantIds: string[]
  ): Promise<RestaurantNameId[]> {
    return axios
      .post(this.endpoint + "/restaurantsByIds/", { restaurantIds })
      .then(responseErrorCheck);
  }

  async noMenuRestaurant(limit: number): Promise<Restaurant[]> {
    return axios
      .get(this.endpoint + "/noMenu/" + limit)
      .then(responseErrorCheck);
  }

  async withMenuRestaurant(limit: number): Promise<Restaurant[]> {
    return axios
      .get(this.endpoint + "/withMenu/" + limit)
      .then(responseErrorCheck);
  }

  async restaurantRanking(comune?: string): Promise<Restaurant[]> {
    const comuneQuery = comune ? `?comune=${comune}` : "";
    return axios
      .get(this.endpoint + "/restaurantRanking" + comuneQuery)
      .then(responseErrorCheck);
  }
}

export default new RestaurantApi();
