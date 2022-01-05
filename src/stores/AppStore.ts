import { Cart } from "./CartStore";
import Storage from "utils/Storage";
import store from "redux/store";
import { sleep } from "utils/helper";
import { User } from "types";
import axios from "axios";

class AppStore {
  cart: Cart = {};
  likes: string[] = [];
  user?: User;

  loadCart = async () => {
    this.cart = await Storage.load("@AppStore:cart", this.cart);
    console.log(this.cart);
  };
  loadLikes = async () => {
    this.likes = await Storage.load("@AppStore:likes", this.likes);
  };
  loadUser = async () => {
    this.user = await Storage.load("@AppStore:user", this.user);
  };

  // TODO CONNECT API
  fetchCart = async () => {};
  fetchLikes = async () => {};

  inizializers = [this.loadUser(), this.loadCart(), this.loadLikes()];
  networkInizializers = [this.fetchCart, this.fetchLikes];

  async loadInitialData() {
    await Promise.all(this.inizializers);
    const accessToken = this.user?.accessToken;
    if (accessToken) {
      axios.defaults.headers.common["authorization"] = accessToken;
      store.dispatch({
        type: "user/init",
        payload: this.user,
      });
    }

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

  async setUser(user?: User) {
    this.user = user;
    if (this.user) await Storage.save("@AppStore:user", user);
    else await Storage.remove("@AppStore:user");
  }
}
export default new AppStore();
