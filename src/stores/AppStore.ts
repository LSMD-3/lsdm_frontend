import Storage from "utils/Storage";
import store from "redux/store";
import { sleep } from "utils/helper";
import { VirtualTable, User, Cart } from "types";
import axios from "axios";

class AppStore {
  cart: Cart = {};
  tableJoined?: VirtualTable;
  likes: string[] = [];
  user?: User;

  loadCart = async () => {
    this.cart = await Storage.load("@AppStore:cart", this.cart);
  };

  loadTableJoined = async () => {
    this.tableJoined = await Storage.load(
      "@AppStore:tableJoined",
      this.tableJoined
    );
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
  fetchTableJoined = async () => {};

  inizializers = [
    this.loadUser(),
    this.loadCart(),
    this.loadLikes(),
    this.loadTableJoined(),
  ];
  networkInizializers = [
    this.fetchCart,
    this.fetchLikes,
    this.fetchTableJoined,
  ];

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
      type: "cart/init",
      payload: { carth: this.cart, tableJoined: this.tableJoined },
    });
  }

  async setCart(cart: Cart) {
    this.cart = cart;
    await Storage.save("@AppStore:cart", cart);
  }

  async setTableJoined(tableJoined: VirtualTable) {
    this.tableJoined = tableJoined;
    await Storage.save("@AppStore:tableJoined", tableJoined);
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
