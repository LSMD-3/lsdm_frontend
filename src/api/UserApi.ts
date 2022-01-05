import { responseErrorCheck, SearchParams } from "./utils";
import axios from "axios";
import { User } from "types";

const endpoint = "user";

export default class UserApi {
  static search(params: SearchParams = {}): Promise<User[]> {
    return axios
      .post(endpoint + "/advancedsearch", params)
      .then(responseErrorCheck);
  }

  static find(userId: string): Promise<User> {
    return axios.get(endpoint + `/${userId}`).then(responseErrorCheck);
  }

  static count(params = {}): Promise<number> {
    return axios
      .post(endpoint + "/advancedcount", params)
      .then(responseErrorCheck);
  }

  static update(user: User): Promise<User> {
    return axios.put(endpoint + `/${user._id}`, user).then(responseErrorCheck);
  }

  static add(user: Partial<User>): Promise<User> {
    return axios.post(endpoint + `/add`, user).then(responseErrorCheck);
  }

  static delete(userId: string): Promise<void> {
    return axios.delete(endpoint + `/${userId}`).then(responseErrorCheck);
  }
}
