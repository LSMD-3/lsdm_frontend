import { Cart } from "./CartStore";
import Storage from "utils/Storage";
import store from "redux/store";
import { sleep } from "utils/helper";

class AppStore {
  cart: Cart = {};
  likes: string[] = [];
  accessToken?: string;

  loadCart = async () => {
    this.cart = await Storage.load("@AppStore:cart", this.cart);
    console.log(this.cart);
  };
  loadLikes = async () => {
    this.likes = await Storage.load("@AppStore:likes", this.likes);
  };
  loadAccessToken = async () => {
    this.accessToken = await Storage.load(
      "@AppStore:accessToken",
      this.accessToken
    );
  };

  // TODO CONNECT API
  fetchCart = async () => {};
  fetchLikes = async () => {};

  inizializers = [this.loadAccessToken(), this.loadCart(), this.loadLikes()];
  networkInizializers = [this.fetchCart, this.fetchLikes];

  async loadInitialData() {
    await Promise.all(this.inizializers);

    console.log(this.cart, this.likes);
    sleep(1000).then(() => {
      this.initializeReducers();
    });

    await Promise.all(this.networkInizializers);
  }

  initializeReducers() {
    store.dispatch({
      type: "item/initLikes",
      payload: this.likes,
    });
    store.dispatch({
      type: "cart/initCart",
      payload: this.cart,
    });
  }

  async setCart(cart: Cart) {
    this.cart = cart;
    await Storage.save("@AppStore:cart", cart);
  }

  async setLikes(likes: string[]) {
    this.likes = likes;
    await Storage.save("@AppStore:likes", likes);
  }

  async setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
    await Storage.save("@AppStore:accessToken", accessToken);
  }
}
export default new AppStore();
