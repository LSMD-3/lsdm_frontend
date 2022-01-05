import { responseErrorCheck, SearchParams } from "./utils";
import axios from "axios";
import { Restaurant } from "types";

const endpoint = "restaurant";

export default class RestaurantApi {
  static search(params: SearchParams = {}): Promise<Restaurant[]> {
    return axios
      .post(endpoint + "/advancedsearch", params)
      .then(responseErrorCheck);
  }

  static find(restaurantId: string): Promise<Restaurant> {
    return axios.get(endpoint + `/${restaurantId}`).then(responseErrorCheck);
  }

  static count(params = {}): Promise<number> {
    return axios
      .post(endpoint + "/advancedcount", params)
      .then(responseErrorCheck);
  }

  static update(restaurant: Restaurant): Promise<Restaurant> {
    return axios
      .put(endpoint + `/${restaurant._id}`, restaurant)
      .then(responseErrorCheck);
  }

  static add(restaurant: Restaurant): Promise<Restaurant> {
    return axios.put(endpoint + `/add`, restaurant).then(responseErrorCheck);
  }

  static delete(restaurant: Restaurant): Promise<void> {
    return axios.put(endpoint + `/${restaurant._id}`).then(responseErrorCheck);
  }
}
