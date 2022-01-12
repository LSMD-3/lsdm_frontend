import store from "./store";

export function logoutAndClearState() {
  store.dispatch({
    type: "user/logout",
    payload: undefined,
  });
  store.dispatch({ type: "cart/init", payload: { cart: {} } });
}
