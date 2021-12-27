type actionType = "user/login" | "user/logout";

interface User {
  email: string;
  name: string;
}

interface UserData {
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
      return { authenticated: true, user: action.payload };
    }

    case "user/logout": {
      return { authenticated: false, user: undefined };
    }

    default:
      return state;
  }
}
