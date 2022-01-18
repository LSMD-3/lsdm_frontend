import { responseErrorCheck, SearchParams } from "./utils";
import axios from "axios";
import { User } from "types";
import { BaseResource } from "./BaseResource";

class UserApi extends BaseResource<User> {
  endpoint = "user";

  async getFollowerEmails(userId: string): Promise<Partial<User>> {
    return axios
      .get(this.endpoint + `/followers/${userId}`)
      .then(responseErrorCheck);
  }

  async getFollowsEmail(userId: string): Promise<{_id:string, email:string}[]> {
    return axios.get(this.endpoint + `/followsemails/${userId}`).then(responseErrorCheck)
  }

}

export default new UserApi();
