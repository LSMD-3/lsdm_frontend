import { responseErrorCheck, SearchParams } from "./utils";
import axios from "axios";
import { User } from "types";
import { BaseResource } from "./BaseResource";
class UserApi extends BaseResource<User> {
  endpoint = "user";

  async getNormalUsers(limit: number) {
    return axios
      .get(this.endpoint + `/normalUser/${limit}`)
      .then(responseErrorCheck);
  }
}

export default new UserApi();
