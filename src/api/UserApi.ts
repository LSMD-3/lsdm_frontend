import { responseErrorCheck, SearchParams } from "./utils";
import axios from "axios";
import { User } from "types";
import { BaseResource } from "./BaseResource";

class UserApi extends BaseResource<User> {
  endpoint = "user";
}

export default new UserApi();
