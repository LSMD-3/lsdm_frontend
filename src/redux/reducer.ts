import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./cartReducer";
import likesReducer from "./likesReducer";

const rootReducer = combineReducers({
  cartState: cartReducer,
  likesState: likesReducer,
});

export default rootReducer;
