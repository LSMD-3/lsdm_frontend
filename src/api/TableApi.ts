import axios from "axios";
import { Category, Table } from "types";
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
}

export default new TableApi();
