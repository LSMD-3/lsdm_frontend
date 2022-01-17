import { RestaurantApi, TableApi } from "api";

import { useEffect, useState } from "react";
import { Item, Restaurant, Menu, Order } from "types";
import {
  Container,
  CssBaseline,
  CircularProgress,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import store, { userState, cartState } from "redux/store";
import { useSnackbar } from "notistack";
import { ItemList } from "components";
import { extractItemsFromMenu } from "helpers";

export default function RestaurantTable() {
  const [restaurant, setrestaurant] = useState<Restaurant>();
  const [menu, setMenu] = useState<Menu>();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector(userState);
  const cart = useSelector(cartState);

  useEffect(() => {
    if (user.user?.joinedTable)
      fetchRestaurant(user.user?.joinedTable.restaurant._id);
    return () => {};
  }, []);

  const fetchRestaurant = async (restaurantId: string) => {
    try {
      const restaurant = await RestaurantApi.find(restaurantId);
      const menu = await RestaurantApi.getMenu(restaurantId);
      setrestaurant(restaurant);
      setMenu(menu);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  if (user.user?.joinedTable === undefined)
    return (
      <div>
        <h2>{"Table not found"}</h2>
      </div>
    );

  // TODO NEO4J INTEGRATION
  const toggleItemLike = (item: Item) => {};
  // TODO REDIS INTEGRATION
  const increment = (item: Item) => {
    store.dispatch({
      type: "cart/addItem",
      payload: item,
    });
  };

  const decrement = (item: Item) => {
    store.dispatch({
      type: "cart/decreaseItemQuantity",
      payload: item,
    });
  };

  if (!menu)
    return (
      <CircularProgress
        style={{ position: "absolute", top: 200, right: "50%" }}
      />
    );

  const items: Item[] = extractItemsFromMenu(menu).map((itm) => {
    if (cart) itm.quantity = cart[itm._id];
    itm.note = "";
    return itm;
  });

  const totalRecipes = Object.keys(cart).reduce(
    (prev, curr) => prev + (cart[curr] ?? 0),
    0
  );

  const submitOrder = async () => {
    const order: Order = [];
    Object.keys(cart).forEach((id) => {
      const row = { _id: id, qty: cart[id], note: "" };
      order.push(row);
    });

    try {
      await TableApi.submitOrder(
        restaurant!._id,
        String(user.user!.joinedTable!.tableNumber),
        order
      );
      enqueueSnackbar("Ordes submitted", { variant: "success" });
      store.dispatch({ type: "cart/init", payload: { cart: {} } });
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  return (
    <Container>
      <CssBaseline />
      <h2 onClick={() => RestaurantApi.addOrder()} className="clickable">
        {" Table " + user.user?.joinedTable.tableNumber}
      </h2>
      <h3>Partecipants</h3>
      {totalRecipes > 0 && (
        <Button variant="contained" onClick={submitOrder}>
          Submit Order
        </Button>
      )}
      <ItemList
        items={items}
        toggleItemLike={toggleItemLike}
        increment={increment}
        decrement={decrement}
      />
    </Container>
  );
}
