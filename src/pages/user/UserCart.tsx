import {
  Container,
  CssBaseline,
  CircularProgress,
  Button,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import store, { userState, cartState, likeState } from "redux/store";
import { MenuRecipe, Restaurant, Menu, Item, Order, RecipeOrder } from "types";
import { TableApi, RestaurantApi, Neo4jUserApi } from "api";
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
    if (!user.user) return;
    if (!user.user.joinedTable) return;

    const restaurantId = user.user.joinedTable.restaurant._id;
    const tableId = user.user.joinedTable.tableNumber;
    fetchRestaurant(restaurantId);
    fetchPreviousOrders(user.user.joinedTable.restaurant, tableId);

    return () => {};
  }, []);

  const fetchPreviousOrders = async (
    restaurant: Restaurant,
    tableId: string
  ) => {
    try {
      const orders = await TableApi.get_all_user_orders(
        restaurant,
        tableId,
        user.user!
      );
      setOrders(orders);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  const fetchRestaurant = async (restaurantId: string) => {
    try {
      const restaurant = await RestaurantApi.find(restaurantId);
      setMenu(restaurant.menus[0]);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  const submitOrder = async () => {
    const order: RecipeOrder[] = [];
    Object.keys(cart).forEach((id) => {
      const recipe = menu!.recipes.find((r) => r._id === id);
      if (recipe) {
        const row: RecipeOrder = {
          _id: id,
          ingredients: recipe.ingredients,
          recipe_name: recipe.recipe_name,
          image_url: recipe.image_url,
          qty: cart[id],
          note: "",
          status: "In preparation",
        };
        order.push(row);
      }
    });

    try {
      await TableApi.submitOrder(
        restaurant!,
        String(user.user!.joinedTable!.tableNumber),
        user.user!,
        order
      );
      enqueueSnackbar("Ordes submitted", { variant: "success" });
      const tableId = user.user!.joinedTable!.tableNumber;
      fetchPreviousOrders(restaurant!, tableId);
      store.dispatch({ type: "cart/init", payload: { cart: {} } });
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  const closeTableSession = async () => {
    const restaurant = user.user!.joinedTable!.restaurant;
    const tableId = user.user!.joinedTable!.tableNumber;

    try {
      await TableApi.checkout_Table(restaurant, tableId);

      enqueueSnackbar("Table Closed", { variant: "success" });
      store.dispatch({ type: "table/left", payload: {} });
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  const toggleItemLike = (item: Item, liked: boolean) => {
    store.dispatch({ type: "recipe/toggleLike", payload: item._id });
    if (liked) {
      Neo4jUserApi.likeRecipe(user.user!._id, item._id);
    } else {
      Neo4jUserApi.unlikeRecipe(user.user!._id, item._id);
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

  if (!user.user?.joinedTable)
    return (
      <Container>
        <CssBaseline />
        <h2>Join a restaurant to see cart</h2>
      </Container>
    );

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

  const isCartEmpty = !cart || Object.keys(cart).length === 0;

  const renderOrder = (order: Order, i: number) => {
    const recipeIds = order.map((o) => o._id);
    const items: Item[] = extractItemsFromMenu(menu)
      .filter((itm) => recipeIds.includes(itm._id))
      .map((itm) => {
        const recipeOrdered = order.find((o) => o._id === itm._id);
        if (recipeOrdered) {
          itm.quantity = recipeOrdered.qty;
          itm.note = recipeOrdered.note;
          itm.status = recipeOrdered.status;
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {isCartEmpty && <h3>Cart is empty</h3>}
        <Button variant="contained" onClick={closeTableSession}>
          Close Table
        </Button>
      </div>
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
