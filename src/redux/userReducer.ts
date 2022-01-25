import axios from "axios";
import AppStore from "stores/AppStore";
import { User } from "types";
import store from "./store";

type actionType =
  | "user/login"
  | "user/logout"
  | "user/init"
  | "table/join"
  | "table/left"
  | "restaurant/join";

export interface UserData {
  authenticated: boolean;
  user?: User;
}

const userState: UserData = {
  authenticated: false,
};

export default function userReducer(
  state = userState,
  action: { payload: any; type: actionType }
) {
  switch (action.type) {
    case "user/login": {
      const { email } = action.payload as User;
      if (!email) return state;
      AppStore.setUser(action.payload);
      axios.defaults.headers.common["authorization"] =
        action.payload.accessToken; // for all requests
      return { authenticated: true, user: action.payload };
    }

    case "user/logout": {
      axios.defaults.headers.common["authorization"] = "null";
      AppStore.setUser(undefined);
      return { authenticated: false, user: undefined };
    }

    case "table/join": {
      const joinedTable = action.payload;
      state.user!.joinedTable = joinedTable;
      AppStore.setUser(state.user);
      return { ...state };
    }

    case "restaurant/join": {
      const joinedRestaurant = action.payload;
      state.user!.joinedRestaurant = joinedRestaurant;
      AppStore.setUser(state.user);
      return { ...state };
    }

    case "table/left": {
      state.user!.joinedTable = undefined;
      AppStore.setUser(state.user);
      return { ...state };
    }

    case "user/init": {
      const user = action.payload;
      return { authenticated: true, user };
    }

    default:
      return state;
  }
}
