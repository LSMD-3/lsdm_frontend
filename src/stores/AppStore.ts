import CartStore from "./CartStore";
import LikeStore from "./LikeStore";

class AppStore {
  async loadInitialData() {
    console.log("App store is initialized");
    await Promise.all([
      await LikeStore.loadInitialData(),
      await CartStore.loadInitialData(),
    ]);
  }
}
export default new AppStore();
