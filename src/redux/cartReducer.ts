import { Cart, Item } from "stores";
import sleep from "utils/helper";

type actionType =
  | "cart/addItem"
  | "cart/increaseItemQuantity"
  | "cart/decreaseItemQuantity"
  | "cart/removeItem"
  | "cart/initCart";
// sku quantity

interface State {
  cart: Cart;
}

const cartState: State = {
  cart: {},
};

function checkItem(item: Item) {
  return true;
}

async function updateItemQuantity(
  cartState: State,
  item: Item,
  increment: number
) {
  let newCart = { ...cartState.cart };
  // update quantity
  if (Object.keys(cartState.cart).includes(item.id)) {
    const quantity = newCart[item.id] + increment;
    if (quantity > 0) newCart[item.id] = newCart[item.id] + increment;
    if (quantity <= 0) delete newCart[item.id];
    // TODO API CALL HERE
    await sleep(100);
    return { ...cartState, cart: newCart };
  }

  // new item added
  await sleep(100);
  if (increment > 0) newCart[item.id] = increment;
  return { ...cartState, cart: newCart };
}

export default async function cartReducer(
  state = cartState,
  action: { payload: any; type: actionType }
) {
  switch (action.type) {
    case "cart/addItem":
    case "cart/increaseItemQuantity": {
      const item = action.payload;
      if (!checkItem(item)) return state;
      return await updateItemQuantity(cartState, item, 1);
    }

    case "cart/removeItem": {
      const item = action.payload;
      if (!checkItem(item)) return state;
      return await updateItemQuantity(cartState, item, -1000000);
    }

    case "cart/initCart": {
      const cart = action.payload;
      if (Array.isArray(cart)) return { cart };
      return { cart: [] };
    }

    case "cart/decreaseItemQuantity": {
      const item = action.payload;
      if (!checkItem(item)) return state;
      return await updateItemQuantity(cartState, item, -1);
    }
    default:
      return state;
  }
}
