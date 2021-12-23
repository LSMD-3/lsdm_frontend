import { createStore } from "redux";
import { Cart } from "stores";
import rootReducer from "./reducer";

// let preloadedState: { cart: Cart; likes: string[] };
// const persistedTodosString = localStorage.getItem("cart");

// if (persistedTodosString) {
//   preloadedState = {
//     cart: {},
//     likes: [],
//   };
// }

const store = createStore(rootReducer);

export default store;
