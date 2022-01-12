import { createStore } from "redux";
import { Cart } from "types";
import { CartData } from "./cartReducer";
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
  return state.cartState as CartData;
};
export const likeState = (state: any) => {
  return state.likesState.itemLikes as string[];
};
export const userState = (state: any) => {
  return state.userState as UserData;
};

export default store;
