import { responseErrorCheck } from "./utils";
import axios from "axios";
import { Menu, Restaurant, RestaurantNameId, UserType } from "types";
import { BaseResource } from "./BaseResource";

class RestaurantApi extends BaseResource<Restaurant> {
  endpoint = "restaurant";

  async addOrder() {
    return axios.post(this.endpoint + "/order/add").then(responseErrorCheck);
  }

  async findRestaurantOfStaff(
    userId: string,
    userType: UserType
  ): Promise<Restaurant> {
    return axios
      .get(this.endpoint + `/staff/${userId}/${userType}`)
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
