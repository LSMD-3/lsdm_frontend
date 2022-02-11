import axios from "axios";
import { Category, Recipe } from "types";
import { responseErrorCheck } from "./utils";
export type RestaurantNameId = { _id: string; nome: string };

class Neo4jApi {
  endpoint = "neo4j";

  async addFriend(follower: string, followee: string): Promise<void> {
    return;
    return axios
      .post(this.endpoint + `/follow`, { follower, followee })
      .then(responseErrorCheck);
  }

  async getFollowersCount(userId: string): Promise<number[]> {
    return [];
    return axios
      .get(this.endpoint + `/followers/${userId}`)
      .then(responseErrorCheck);
  }

  async getFollowsCount(userId: string): Promise<number[]> {
    return [];
    return axios
      .get(this.endpoint + `/follows/${userId}`)
      .then(responseErrorCheck);
  }

  async unfollowFriend(follower: string, followee: string): Promise<void> {
    return;
    return axios
      .post(this.endpoint + `/unfollowUser`, { follower, followee })
      .then(responseErrorCheck);
  }

  async likeRestaurant(user: string, restaurant: string): Promise<void> {
    return;
    return axios
      .post(this.endpoint + `/likerestaurant`, { user, restaurant })
      .then(responseErrorCheck);
  }

  async unlikeRestaurant(user: string, restaurant: string): Promise<void> {
    return;
    return axios
      .post(this.endpoint + `/unlikerestaurant`, { user, restaurant })
      .then(responseErrorCheck);
  }

  async likeRecipe(user: string, recipe: string): Promise<void> {
    return;
    return axios
      .post(this.endpoint + `/likerecipe`, { user, recipe })
      .then(responseErrorCheck);
  }

  async unlikeRecipe(user: string, recipe: string): Promise<void> {
    return;
    return axios
      .post(this.endpoint + `/unlikerecipe`, { user, recipe })
      .then(responseErrorCheck);
  }

  async likedRestaurant(user: string): Promise<string[]> {
    return [];
    return axios
      .get(this.endpoint + `/likedRestaurant/` + user)
      .then(responseErrorCheck);
  }

  async likedRecipe(user: string): Promise<string[]> {
    return [];
    return axios
      .get(this.endpoint + `/likedRecipe/` + user)
      .then(responseErrorCheck);
  }

  async suggestFriends(userId: string): Promise<void> {
    return;
    return axios
      .get(this.endpoint + `/suggestfriends/${userId}`)
      .then(responseErrorCheck);
  }

  async suggestrestaurants(userId: string): Promise<void> {
    return;
    return axios
      .get(this.endpoint + `/suggestrestaurants/${userId}`)
      .then(responseErrorCheck);
  }

  async suggestRecipes(userId: string): Promise<void> {
    return;
    return axios
      .get(this.endpoint + `/suggestrecipes/${userId}`)
      .then(responseErrorCheck);
  }
}

export default new Neo4jApi();
