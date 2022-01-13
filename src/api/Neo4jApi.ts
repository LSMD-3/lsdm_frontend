import axios from "axios";
import { Category, Recipe } from "types";
import { responseErrorCheck } from "./utils";

class Neo4jApi {
  endpoint = "neo4j";

  async addFriend(follower: string, followee: string): Promise<void> {
    return axios
      .post(this.endpoint + `/follow`, { follower, followee })
      .then(responseErrorCheck);
  }
}

export default new Neo4jApi();
