import { RestaurantApi, TableApi } from "api";

import { useEffect, useState } from "react";
import { Item, Restaurant } from "types";
import { Container, CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";
import store, { userState, cartState } from "redux/store";
import { useSnackbar } from "notistack";
import { ItemList } from "components";
import { extractItemsFromMenuRecipes } from "helpers";

export default function RestaurantTable() {
  const [restaurant, setrestaurant] = useState<Restaurant>();
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
      setrestaurant(restaurant);
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

  const allRecipes = user.user.joinedTable.restaurant.menu.recipes;

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

  const items: Item[] = extractItemsFromMenuRecipes(allRecipes).map((itm) => {
    if (cart) itm.quantity = cart[itm._id];
    itm.note = "";
    return itm;
  });

  return (
    <Container>
      <CssBaseline />
      <h2 onClick={() => RestaurantApi.addOrder()} className="clickable">
        {" Table " + user.user?.joinedTable.tableNumber}
      </h2>
      <h3>Partecipants</h3>
      <ItemList
        items={items}
        toggleItemLike={toggleItemLike}
        increment={increment}
        decrement={decrement}
      />
    </Container>
  );
}
