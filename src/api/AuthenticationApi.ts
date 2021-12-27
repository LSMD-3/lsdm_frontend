import { responseErrorCheck } from "api";
import axios from "axios";

const endpoint = "auth";

export default class AuthenticationApi {
  static login(email: string, password: string): Promise<any> {
    return axios
      .post(endpoint + "/login", { email: email, password: password })
      .then(responseErrorCheck)
      .catch(responseErrorCheck);
  }
}
