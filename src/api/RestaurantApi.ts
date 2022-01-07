import { responseErrorCheck, SearchParams } from "./utils";
import axios from "axios";
import { Restaurant } from "types";
import { BaseResource } from "./BaseResource";

class RestaurantApi extends BaseResource<Restaurant> {
  endpoint = "restaurant";
}

export default new RestaurantApi();
