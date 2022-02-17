import axios from "axios";
import { User } from "types";

import { responseErrorCheck } from "../utils";

class Neo4jUserApi {
  endpoint = "neo4j/restaurant";

  async getMostLikedRestaurants() {
    return axios.get(this.endpoint + `/mostLiked`).then(responseErrorCheck);
  }
}

export default new Neo4jUserApi();
