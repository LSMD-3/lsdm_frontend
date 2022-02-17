import axios from "axios";
import {
  Category,
  Table,
  TableOrder,
  User,
  Restaurant,
  RecipeOrder,
  Order,
  Recipe,
} from "types";
import { BaseResource } from "./BaseResource";
import { responseErrorCheck } from "./utils";

const getUserDao = (user: User) => {
  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    surname: user.surname,
  };
};

export type RecipeHistory = { recipes: Recipe[]; restaurant: Restaurant };

const getRestaurantDao = (restaurant: Restaurant) => {
  return {
    _id: restaurant._id,
    tipologia: restaurant.tipologia,
    nome: restaurant.nome,
    comune: restaurant.comune,
  };
};

class TableApi extends BaseResource<Table> {
  endpoint = "restaurant";

  async joinTable(
    restaurant: Restaurant,
    table_id: string,
    user: User
  ): Promise<Category[]> {
    return axios
      .post(this.endpoint + `/join_tablenew`, {
        restaurant: getRestaurantDao(restaurant),
        table_id: table_id,
        customer: getUserDao(user),
      })
      .then(responseErrorCheck);
  }

  async submitOrder(
    restaurant: Restaurant,
    table_id: string,
    user: User,
    orders: RecipeOrder[]
  ): Promise<Category[]> {
    return axios
      .post(this.endpoint + `/order/create_ordernew`, {
        restaurant: getRestaurantDao(restaurant),
        table_id: table_id,
        customer: getUserDao(user),
        orders: orders,
      })
      .then(responseErrorCheck);
  }

  async updateOrder(
    restaurant: Restaurant,
    table_id: string,
    order_index: string,
    order: Order
  ): Promise<Category[]> {
    return axios
      .post(this.endpoint + `/update_order_new`, {
        restaurant: getRestaurantDao(restaurant),
        table_id: table_id,
        order_index: order_index,
        orders: order,
      })
      .then(responseErrorCheck);
  }

  async get_all_orders(
    restaurant_id: string,
    table_id: string
  ): Promise<RecipeOrder[]> {
    return axios
      .post(this.endpoint + `/get_all_orders`, {
        restaurant_id: restaurant_id,
        table_id: table_id,
      })
      .then(responseErrorCheck);
  }

  async get_orders_for_chef(restaurant: Restaurant): Promise<TableOrder[]> {
    return axios
      .post(this.endpoint + `/get_orders_for_chef_new`, {
        restaurant: restaurant,
      })
      .then(responseErrorCheck);
  }

  async get_all_user_orders(
    restaurant: Restaurant,
    table_id: string,
    user: User
  ): Promise<Order[]> {
    return axios
      .post(this.endpoint + `/table/get_orders_for_user_new`, {
        restaurant: getRestaurantDao(restaurant),
        table_id: table_id,
        customer: getUserDao(user),
      })
      .then(responseErrorCheck);
  }

  async get_table_users(
    restaurant: Restaurant,
    table_id: string
  ): Promise<User[]> {
    return axios
      .post(this.endpoint + `/get_table_users`, {
        restaurant,
        table_id,
      })
      .then(responseErrorCheck);
  }

  async checkout_Table(
    restaurant: Restaurant,
    table_id: string
  ): Promise<void> {
    return axios
      .post(this.endpoint + `/table/check_out`, {
        restaurant: getRestaurantDao(restaurant),
        table_id,
      })
      .then(responseErrorCheck);
  }

  async backupFromRedis(): Promise<void> {
    return axios
      .post(`/tableSession/backupFromRedis`, {})
      .then(responseErrorCheck);
  }

  async recipeRanking(reduced: boolean): Promise<any> {
    return axios
      .get(`/tableSession/recipeRanking/${reduced}`)
      .then(responseErrorCheck);
  }

  async userRanking(reduced: boolean): Promise<any> {
    return axios
      .get(`/tableSession/userRanking/${reduced}`)
      .then(responseErrorCheck);
  }

  async getTopRecipesOfTopVisitedRestaurants(): Promise<any> {
    return axios
      .get(`/tableSession/getTopRecipesOfTopVisitedRestaurants`)
      .then(responseErrorCheck);
  }

  async getMostVisitedRestaurant(): Promise<any> {
    return axios
      .get(`/tableSession/getMostVisitedRestaurant`)
      .then(responseErrorCheck);
  }

  async getRestaurantWithMoreDistinctOrders(): Promise<any> {
    return axios
      .get(`/tableSession/getRestaurantWithMoreDistinctOrders`)
      .then(responseErrorCheck);
  }

  async countUniqueRecipes(): Promise<any> {
    return axios
      .get(`/tableSession/countUniqueRecipes`)
      .then(responseErrorCheck);
  }

  async getRevenueByComune(): Promise<any> {
    return axios
      .get(`/tableSession/getRevenueByComune`)
      .then(responseErrorCheck);
  }
  async getRestaurantRevenue(restaurantId: string): Promise<any> {
    return axios
      .get(`/tableSession/getRestaurantRevenue/` + restaurantId)
      .then(responseErrorCheck);
  }
  async getMostOrderedRecipes(restaurantId: string): Promise<any> {
    return axios
      .get(`/tableSession/getMostOrderedRecipesInARestaurant/` + restaurantId)
      .then(responseErrorCheck);
  }
  async getMostOrderedRecipeForUser(userId: string): Promise<any> {
    return axios
      .get(`/tableSession/getMostOrderedRecipeForUser/` + userId)
      .then(responseErrorCheck);
  }
  async getMostOrderedRecipeForComune(): Promise<any> {
    return axios
      .get(`/tableSession/getMostOrderedRecipeForComune/`)
      .then(responseErrorCheck);
  }

  async getRecipesPokedex(userId: string): Promise<RecipeHistory[]> {
    return axios
      .get(`/tableSession/getRecipesPokedex/${userId}`)
      .then(responseErrorCheck);
  }
}

export default new TableApi();
