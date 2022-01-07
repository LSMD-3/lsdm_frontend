import { responseErrorCheck, SearchParams } from "./utils";
import axios from "axios";
import { Menu, Restaurant } from "types";
import { BaseResource } from "./BaseResource";

class RestaurantApi extends BaseResource<Restaurant> {
  endpoint = "restaurant";

  async getMenu(restaurantId: string): Promise<Menu> {
    return axios
      .get(this.endpoint + `/menu/${restaurantId}`)
      .then(responseErrorCheck);
  }
}

export default new RestaurantApi();
