import axios from "axios";
import { Category, Table, Order, TableOrder, User } from "types";
import { BaseResource } from "./BaseResource";
import { responseErrorCheck } from "./utils";

class TableApi extends BaseResource<Table> {
  endpoint = "restaurant";

  async joinTable(
    restaurant_id: string,
    table_id: string,
    user_id: string
  ): Promise<Category[]> {
    return axios
      .post(this.endpoint + `/join_table`, {
        restaurant_id: restaurant_id,
        table_id: table_id,
        customer: user_id,
      })
      .then(responseErrorCheck);
  }

  async submitOrder(
    restaurant_id: string,
    table_id: string,
    user_id: string,
    order: Order
  ): Promise<Category[]> {
    return axios
      .post(this.endpoint + `/order/create_order`, {
        restaurant_id: restaurant_id,
        table_id: table_id,
        user_id: user_id,
        orders: order,
      })
      .then(responseErrorCheck);
  }

  async updateOrder(
    restaurant_id: string,
    table_id: string,
    order_index: string,
    order: Order
  ): Promise<Category[]> {
    return axios
      .post(this.endpoint + `/update_order`, {
        restaurant_id: restaurant_id,
        table_id: table_id,
        order_index: order_index,
        orders: order,
      })
      .then(responseErrorCheck);
  }

  async get_all_orders(
    restaurant_id: string,
    table_id: string
  ): Promise<Order[]> {
    return axios
      .post(this.endpoint + `/get_all_orders`, {
        restaurant_id: restaurant_id,
        table_id: table_id,
      })
      .then(responseErrorCheck);
  }

  async get_orders_for_chef(restaurant_id: string): Promise<TableOrder[]> {
    return axios
      .post(this.endpoint + `/get_orders_for_chef`, {
        restaurant_id: restaurant_id,
      })
      .then(responseErrorCheck);
  }

  async get_all_user_orders(
    restaurant_id: string,
    table_id: string,
    user_id: string
  ): Promise<Order[]> {
    return axios
      .post(this.endpoint + `/table/get_orders_for_user`, {
        restaurant_id: restaurant_id,
        table_id: table_id,
        user_id: user_id,
      })
      .then(responseErrorCheck);
  }

  async get_table_users(
    restaurant_id: string,
    table_id: string
  ): Promise<User[]> {
    return axios
      .post(this.endpoint + `/get_table_users`, {
        restaurant_id,
        table_id,
      })
      .then(responseErrorCheck);
  }

  async checkout_Table(restaurant_id: string, table_id: string): Promise<void> {
    return axios
      .post(this.endpoint + `/table/check_out`, {
        restaurant_id,
        table_id,
      })
      .then(responseErrorCheck);
  }

  async backupFromRedis(): Promise<void> {
    return axios
      .post(`/tableSession/backupFromRedis`, {})
      .then(responseErrorCheck);
  }
}

export default new TableApi();
