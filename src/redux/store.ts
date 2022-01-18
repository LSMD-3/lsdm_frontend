import { createStore } from "redux";
import { Cart } from "types";
import { LikesState } from "./likesReducer";
import rootReducer from "./reducer";
import { UserData } from "./userReducer";

// let preloadedState: { cart: Cart; likes: string[] };
// const persistedTodosString = localStorage.getItem("cart");

// if (persistedTodosString) {
//   preloadedState = {
//     cart: {},
//     likes: [],
//   };
// }

const store = createStore(rootReducer);

export const cartState = (state: any) => {
  return state.cartState.cart as Cart;
};
export const likeState = (state: any) => {
  return state.likesState as LikesState;
};
export const userState = (state: any) => {
  return state.userState as UserData;
};

export default store;
