import {
  Container,
  CssBaseline,
  CircularProgress,
  Button,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import store, { userState, cartState, likeState } from "redux/store";
import { MenuRecipe, Restaurant, Menu, Item, Order } from "types";
import { TableApi, RestaurantApi, Neo4jApi } from "api";
import { useSnackbar } from "notistack";
import { ItemList } from "components";
import { extractItemsFromMenu } from "helpers";

export default function UserCart() {
  const [restaurant, setrestaurant] = useState<Restaurant>();
  const [menu, setMenu] = useState<Menu>();
  const [orders, setOrders] = useState<Order[]>();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector(userState);
  const cart = useSelector(cartState);
  const likes = useSelector(likeState);

  useEffect(() => {
    if (user.user?.joinedTable) {
      const restaurantId = user.user?.joinedTable.restaurant._id;
      const tableId = user.user?.joinedTable.tableNumber;
      fetchRestaurant(restaurantId);
      fetchPreviousOrders(restaurantId, tableId);
    }

    return () => {};
  }, []);

  const fetchPreviousOrders = async (restaurantId: string, tableId: string) => {
    try {
      const orders = await TableApi.get_all_orders(restaurantId, tableId);
      setOrders(orders);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

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
      const restaurantId = user.user!.joinedTable!.restaurant._id;
      const tableId = user.user!.joinedTable!.tableNumber;
      fetchPreviousOrders(restaurantId, tableId);
      store.dispatch({ type: "cart/init", payload: { cart: {} } });
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  // TODO NEO4J INTEGRATION
  const toggleItemLike = (item: Item, liked: boolean) => {
    store.dispatch({ type: "recipe/toggleLike", payload: item._id });
    if (liked) {
      Neo4jApi.likeRecipe(user.user!._id, item._id);
    } else {
      Neo4jApi.unlikeRecipe(user.user!._id, item._id);
    }
  };
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

  const items: Item[] = extractItemsFromMenu(menu)
    .filter((itm) => cart[itm._id] > 0)
    .map((itm) => {
      if (cart) itm.quantity = cart[itm._id];
      itm.note = "";
      return itm;
    });

  const totalRecipes = Object.keys(cart).reduce(
    (prev, curr) => prev + (cart[curr] ?? 0),
    0
  );

  if (!user.user?.joinedTable)
    return (
      <Container>
        <CssBaseline />
        <h2>Join a restaurant to see cart</h2>
      </Container>
    );

  const isCartEmpty = !cart || Object.keys(cart).length === 0;
  let cartRecipes: MenuRecipe[] = [];

  console.log(cartRecipes);

  const renderOrder = (order: Order, i: number) => {
    const recipeIds = order.map((o) => o._id);
    const items: Item[] = extractItemsFromMenu(menu)
      .filter((itm) => recipeIds.includes(itm._id))
      .map((itm) => {
        const recipeOrdered = order.find((o) => o._id === itm._id);
        if (recipeOrdered) {
          itm.quantity = recipeOrdered.qty;
          itm.note = recipeOrdered.note;
        }
        return itm;
      });

    return (
      <div key={"order_" + i}>
        <h3>Order {i}</h3>
        <ItemList
          likedItems={likes.recipesLikes}
          items={items}
          toggleItemLike={toggleItemLike}
          increment={increment}
          decrement={decrement}
        />
      </div>
    );
  };

  return (
    <Container>
      <CssBaseline />
      <h2>User cart</h2>
      {isCartEmpty && <h3>Cart is empty</h3>}
      {totalRecipes > 0 && (
        <Button variant="contained" onClick={submitOrder}>
          Submit Order
        </Button>
      )}
      {!isCartEmpty && (
        <ItemList
          likedItems={likes.recipesLikes}
          items={items}
          toggleItemLike={toggleItemLike}
          increment={increment}
          decrement={decrement}
        />
      )}
      <h2>Previous orders</h2>
      {orders &&
        orders.map((order, i) => {
          let len = orders.length;
          return renderOrder(order, len - i);
        })}
    </Container>
  );
}
