import Storage from "utils/Storage";
import store from "redux/store";
import { sleep } from "utils/helper";
import { VirtualTable, User, Cart } from "types";
import axios from "axios";
import { RestaurantApi } from "api";

class AppStore {
  cart: Cart = {};
  likes: string[] = [];
  user?: User;

  loadCart = async () => {
    this.cart = await Storage.load("@AppStore:cart", this.cart);
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
  fetchStaffRestaurant = async () => {
    console.log(this.user);
    if (!this.user?._id) return;
    if (!["admin", "waiter", "chef"].includes(this.user.userType)) return;
    try {
      const restaurant = await RestaurantApi.findRestaurantOfStaff(
        this.user?._id,
        this.user.userType
      );
      if (restaurant)
        store.dispatch({ type: "restaurant/join", payload: restaurant });
    } catch (error: any) {}
  };

  inizializers = [this.loadUser(), this.loadCart(), this.loadLikes()];

  networkInizializers = [
    this.fetchCart,
    this.fetchLikes,
    this.fetchTableJoined,
    this.fetchStaffRestaurant,
  ];

  refreshNetworkIntializers = async () =>
    await Promise.all(this.networkInizializers.map((f) => f())); // cool trick isn' it?

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

    this.initializeReducers();
    await this.refreshNetworkIntializers();
  }

  initializeReducers() {
    store.dispatch({
      type: "item/initLikes",
      payload: this.likes,
    });
    store.dispatch({
      type: "cart/init",
      payload: { carth: this.cart },
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
