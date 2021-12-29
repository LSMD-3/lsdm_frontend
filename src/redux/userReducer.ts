import axios from "axios";
import AppStore from "stores/AppStore";
import { User } from "types";

type actionType = "user/login" | "user/logout" | "user/init";

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
      axios.defaults.headers.common["accessToken"] = action.payload.accessToken; // for all requests
      return { authenticated: true, user: action.payload };
    }

    case "user/logout": {
      axios.defaults.headers.common["accessToken"] = "null";
      AppStore.setUser(undefined);
      return { authenticated: false, user: undefined };
    }

    case "user/init": {
      const user = action.payload;
      return { authenticated: true, user };
    }

    default:
      return state;
  }
}
