import { responseErrorCheck } from "api";
import axios from "axios";
import { User } from "types";

const endpoint = "auth";

export default class AuthenticationApi {
  static login(email: string, password: string): Promise<User> {
    return axios
      .post(endpoint + "/login", { email, password })
      .then(responseErrorCheck);
  }

  static signup(
    email: string,
    password: string,
    name: string,
    surname: string
  ): Promise<User> {
    return axios
      .post(endpoint + "/signup", { email, password, name, surname })
      .then(responseErrorCheck);
  }
}
