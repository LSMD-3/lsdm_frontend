import { responseErrorCheck, SearchParams } from "./utils";
import axios from "axios";
import { User } from "types";
import { BaseResource } from "./BaseResource";
class UserApi extends BaseResource<User> {
  endpoint = "generate";

  async generateRandomFollows(id: string, num: number) {
    return axios
      .post(this.endpoint + `/usersfollows`, { id, num })
      .then(responseErrorCheck);
  }
  async generateRandomRecipeLikes(id: string, num: number) {
    return axios
      .post(this.endpoint + `/recipeslikes`, { id, num })
      .then(responseErrorCheck);
  }

  async generateRandomRestaurantLikes(id: string, num: number) {
    return axios
      .post(this.endpoint + `/restaurantslikes`, { id, num })
      .then(responseErrorCheck);
  }
}

export default new UserApi();
