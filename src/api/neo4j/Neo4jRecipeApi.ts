import axios from "axios";
import { User } from "types";

import { responseErrorCheck } from "../utils";

class Neo4jUserApi {
  endpoint = "neo4j/recipe";

  async getMostLikedRecipes(restaurantId: string) {
    return axios
      .get(this.endpoint + `/mostLiked/${restaurantId}`)
      .then(responseErrorCheck);
  }
}

export default new Neo4jUserApi();
