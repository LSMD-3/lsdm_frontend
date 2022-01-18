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

  async getFollowersCount(userId: string): Promise<number[]> {
    return axios
      .get(this.endpoint + `/followers/${userId}`)
      .then(responseErrorCheck);
  }

  async getFollowsCount(userId: string): Promise<number[]> {
    return axios.get(this.endpoint + `/follows/${userId}`).then(responseErrorCheck)
  }


  async unfollowFriend(follower: string, followee: string): Promise<void>{
    return axios
    .post(this.endpoint + `/unfollowUser`, {follower, followee})
    .then(responseErrorCheck)
  }

  async likeRestaurant(user:string, restaurant: string): Promise<void> {
    return axios
      .post(this.endpoint + `/likerestaurant`, {user, restaurant})
      .then(responseErrorCheck);   
  }

  async likeRecipe(user: string, recipe: string): Promise<void> {
    return axios
      .post(this.endpoint +  `/likerecipe`, {user, recipe})
      .then(responseErrorCheck);
  }
}

export default new Neo4jApi();
