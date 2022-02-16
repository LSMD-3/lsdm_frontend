import axios from "axios";
import { User } from "types";

import { responseErrorCheck } from "../utils";

class Neo4jUserApi {
  endpoint = "neo4j/user";

  async followUser(follower: string, followee: string) {
    return axios
      .post(this.endpoint + `/followUser`, {
        follower: follower,
        followee: followee,
      })
      .then(responseErrorCheck);
  }

  async unfollowUser(follower: string, followee: string) {
    return axios
      .post(this.endpoint + `/deletefollowUser`, {
        follower: follower,
        followee: followee,
      })
      .then(responseErrorCheck);
  }

  async likeRestaurant(user: string, restaurant: string) {
    return axios
      .post(this.endpoint + `/likeRestaurant`, {
        userId: user,
        restaurant: restaurant,
      })
      .then(responseErrorCheck);
  }

  async unlikeRestaurant(user: string, restaurant: string) {
    return axios
      .post(this.endpoint + `/deletelikeRestaurant`, {
        userId: user,
        restaurant: restaurant,
      })
      .then(responseErrorCheck);
  }

  async likeRecipe(user: string, recipe: string) {
    return axios
      .post(this.endpoint + `/likeRecipe`, {
        userId: user,
        recipeId: recipe,
      })
      .then(responseErrorCheck);
  }

  async unlikeRecipe(user: string, recipe: string) {
    return axios
      .post(this.endpoint + `/deletelikeRecipe`, {
        userId: user,
        recipeId: recipe,
      })
      .then(responseErrorCheck);
  }

  async eatRecipe(user: string, recipe: string) {
    return axios
      .post(this.endpoint + `/eatRecipe`, {
        userId: user,
        recipeId: recipe,
      })
      .then(responseErrorCheck);
  }

  async uneatRecipe(user: string, recipe: string) {
    return axios
      .post(this.endpoint + `/deleteeatRecipe`, {
        userId: user,
        recipeId: recipe,
      })
      .then(responseErrorCheck);
  }

  async getFollowers(user: string) {
    return axios
      .get(this.endpoint + `/followers/${user}`)
      .then(responseErrorCheck);
  }

  async getFollows(user: string) {
    return axios
      .get(this.endpoint + `/follows/${user}`)
      .then(responseErrorCheck);
  }

  async suggestfriends(user: string) {
    return axios
      .get(this.endpoint + `/suggestfriends/${user}`)
      .then(responseErrorCheck);
  }

  async suggestrecipes(user: string) {
    return axios
      .get(this.endpoint + `/suggestrecipes/${user}`)
      .then(responseErrorCheck);
  }

  async suggestrestaurants(user: string) {
    return axios
      .get(this.endpoint + `/suggestrestaurants/${user}`)
      .then(responseErrorCheck);
  }

  async deleteAllNodes() {
    return axios.delete(this.endpoint + `/all`).then(responseErrorCheck);
  }

  async getLikedRestaurants(userId: string) {
    return axios
      .get(this.endpoint + `/likedRestaurant/${userId}`)
      .then(responseErrorCheck);
  }

  async getLikedRecipes(userId: string) {
    return axios
      .get(this.endpoint + `/likedRecipes/${userId}`)
      .then(responseErrorCheck);
  }
}

export default new Neo4jUserApi();
