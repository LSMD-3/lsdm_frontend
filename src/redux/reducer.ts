import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./cartReducer";
import likesReducer from "./likesReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  cartState: cartReducer,
  likesState: likesReducer,
  userState: userReducer,
});

export default rootReducer;
