export type Cart = Record<string, number>;

export interface Item {
  id: string;
  name: string;
}

class CartStore {
  async loadInitialData() {
    console.log("Cart store is initialized");
  }
}
export default new CartStore();
