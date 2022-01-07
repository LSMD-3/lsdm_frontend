import { responseErrorCheck, SearchParams } from "./utils";
import axios from "axios";

export abstract class BaseResource<Resource> {
  abstract endpoint: string;
  async search(params: SearchParams = {}): Promise<Resource[]> {
    const res = await axios.post(this.endpoint + "/advancedsearch", params);
    return responseErrorCheck(res);
  }

  async find(recipeId: string): Promise<Resource> {
    return axios.get(this.endpoint + `/${recipeId}`).then(responseErrorCheck);
  }

  async count(params = {}): Promise<number> {
    return axios
      .post(this.endpoint + "/advancedcount", params)
      .then(responseErrorCheck);
  }

  async update(resource: Resource): Promise<Resource> {
    return (
      axios
        // @ts-ignore
        .put(this.endpoint + `/${resource._id}`, resource)
        .then(responseErrorCheck)
    );
  }

  async add(resource: Partial<Resource>): Promise<Resource> {
    return axios
      .post(this.endpoint + `/add`, resource)
      .then(responseErrorCheck);
  }

  async delete(resourceId: string): Promise<void> {
    return axios
      .delete(this.endpoint + `/${resourceId}`)
      .then(responseErrorCheck);
  }
}
