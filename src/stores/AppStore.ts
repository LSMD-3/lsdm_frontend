import Storage from "utils/Storage";
import store from "redux/store";
import { sleep } from "utils/helper";
import { VirtualTable, User, Cart } from "types";
import axios from "axios";
import { Neo4jApi, RestaurantApi } from "api";
import { LikesState } from "redux/likesReducer";

class AppStore {
  cart: Cart = {};

  likesState: LikesState = { recipesLikes: [], restaurantLikes: [] };
  user?: User;

  loadCart = async () => {
    this.cart = await Storage.load("@AppStore:cart", this.cart);
  };

  loadLikes = async () => {
    this.likesState = await Storage.load(
      "@AppStore:likesState",
      this.likesState
    );
  };

  loadUser = async () => {
    this.user = await Storage.load("@AppStore:user", this.user);
  };

  // TODO CONNECT API
  fetchCart = async () => {};
  fetchLikes = async () => {
    if (this.user) {
      const restaurantLikes: string[] = []; //await Neo4jApi.likedRestaurant(this.user._id);
      const recipeLikes: string[] = []; //await Neo4jApi.likedRecipe(this.user._id);
      this.likesState.recipesLikes = recipeLikes;
      this.likesState.restaurantLikes = restaurantLikes;
      this.setLikes(this.likesState);
    }
  };
  fetchTableJoined = async () => {};
  fetchStaffRestaurant = async () => {
    console.log(this.user);
    if (!this.user?._id) return;

    // if (!["admin", "waiter", "chef"].includes(this.user.userType)) return;
    try {
      const restaurantAdmin = await RestaurantApi.findRestaurantOfStaff(
        this.user?._id,
        "admin"
      );
      const restaurantWaiter = await RestaurantApi.findRestaurantOfStaff(
        this.user?._id,
        "waiter"
      );
      const restaurantChef = await RestaurantApi.findRestaurantOfStaff(
        this.user?._id,
        "chef"
      );

      if (restaurantAdmin) {
        return store.dispatch({
          type: "restaurant/join",
          payload: { restaurant: restaurantAdmin, role: "admin" },
        });
      }
      if (restaurantWaiter) {
        return store.dispatch({
          type: "restaurant/join",
          payload: { restaurant: restaurantWaiter, role: "waiter" },
        });
      }
      if (restaurantChef) {
        return store.dispatch({
          type: "restaurant/join",
          payload: { restaurant: restaurantChef, role: "chef" },
        });
      }
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

    await this.refreshNetworkIntializers();
    this.initializeReducers();
  }

  initializeReducers() {
    store.dispatch({
      type: "initLikes",
      payload: this.likesState,
    });
    store.dispatch({
      type: "cart/init",
      payload: { cart: this.cart },
    });
  }

  async setCart(cart: Cart) {
    this.cart = cart;
    await Storage.save("@AppStore:cart", cart);
  }

  async setLikes(likesState: LikesState) {
    this.likesState = likesState;
    await Storage.save("@AppStore:likesState", likesState);
  }

  async setUser(user?: User) {
    this.user = user;
    if (this.user) await Storage.save("@AppStore:user", user);
    else await Storage.remove("@AppStore:user");
  }
}
export default new AppStore();
