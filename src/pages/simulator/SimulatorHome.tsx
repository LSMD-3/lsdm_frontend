import { useState } from "react";
import { Container, Button, CssBaseline } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Category, Restaurant, User, Recipe, Order } from "types";
import { SearchBar } from "components";
import { RecipeApi, RestaurantApi, UserApi, TableApi } from "api";
import { useSnackbar } from "notistack";

const SIMULATOR_CONFIG = {
  RECIPES: 5000,
  MAX_QUANTITY_OF_RECIPE: 4,
  MAX_QUANTITY_OF_ORDERS: 5,
  CLOSE_TABLES: false,
  JOIN_TABLE: false,
};

const N = [
  10, 25, 50, 100, 200, 300, 500, 650, 800, 1000, 1200, 1500, 1800, 2200, 2500,
];

export default function SimulatorHome() {
  const { enqueueSnackbar } = useSnackbar();
  const [message, setmessage] = useState("");

  const getRandomNumberInRange = (from: number, to: number) =>
    from + Math.trunc(Math.random() * (to - from));

  const fetchDatasForMenuGeneration = async () => {
    try {
      const restaurants = await RestaurantApi.noMenuRestaurant(100);
      const categories = await RecipeApi.getCategories();
      return { restaurants, categories };
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
    return false;
  };

  const getRandomComposition = async (categories: Category[]) => {
    const percentages = new Array(categories.length);
    for (let i = 0; i < categories.length; i++) {
      percentages[i] = Math.trunc(Math.random() * 5) * 10;
    }
    const composition = categories.map((cat, i) => {
      return { category: cat.category, percentage: percentages[i] };
    });

    return composition;
  };

  const generateMenu = async (
    restaurantId: string,
    categories: Category[],
    restaurantName: string
  ) => {
    const composition = await getRandomComposition(categories);
    const totalRecipes = getRandomNumberInRange(10, 100);
    const startPrice = getRandomNumberInRange(5, 10);
    const endPrice = getRandomNumberInRange(11, 50);

    try {
      await RestaurantApi.createMenu(restaurantId, {
        totalRecipes,
        composition,
        startPrice,
        endPrice,
      });
      setmessage("Menu created for restaurant " + restaurantName);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  const startMenuGeneration = async () => {
    setmessage("Fetching datas for menu generation..");
    const res = await fetchDatasForMenuGeneration();
    if (!res) return;
    const restaurants = res.restaurants;

    const promises = restaurants.map((r) =>
      generateMenu(r._id, res.categories, r.nome)
    );

    const start = new Date();

    await Promise.all(promises);

    const time = new Date().getTime() - start.getTime();

    setmessage(`Completed in ${time} ms`);
  };

  const makeOrder = async (
    userId: string,
    restaurantId: string,
    tableId: string,
    recipes: Recipe[]
  ) => {
    const order: Order = [];
    const recipeCount = getRandomNumberInRange(0, 6);
    for (let i = 0; i < recipeCount; i++) {
      const recipe = recipes[getRandomNumberInRange(0, recipes.length)];
      const row = {
        _id: recipe._id,
        qty: getRandomNumberInRange(1, SIMULATOR_CONFIG.MAX_QUANTITY_OF_RECIPE),
        status: "In preparation",
      };
      order.push(row);
    }

    try {
      await TableApi.submitOrder(restaurantId, tableId, userId, order);
      return true;
    } catch (error: any) {
      return false;
    }
  };

  const joinRandomTableAndCreateOrders = async (
    user: User,
    restaurants: Restaurant[],
    recipes: Recipe[]
  ) => {
    const myRestaurant =
      restaurants[getRandomNumberInRange(0, restaurants.length)];
    const myTable = getRandomNumberInRange(0, 30);

    if (SIMULATOR_CONFIG.JOIN_TABLE)
      await TableApi.joinTable(myRestaurant._id, "" + myTable, user._id);

    const orderCount = getRandomNumberInRange(
      1,
      SIMULATOR_CONFIG.MAX_QUANTITY_OF_ORDERS
    );
    for (let i = 0; i < orderCount; i++) {
      await makeOrder(user._id, myRestaurant._id, "" + myTable, recipes);
    }

    return { table: "" + myTable, restaurant: myRestaurant._id, orderCount };
  };

  const closeTable = async (table: string, restaurant: string) => {
    if (SIMULATOR_CONFIG.CLOSE_TABLES)
      await TableApi.checkout_Table(restaurant, table);
  };

  const fetchDatasForOrderGeneration = async (
    restaurants: Restaurant[],
    recipes: Recipe[],
    userCount: number
  ) => {
    // fetch a set of restaurant
    const users = await UserApi.getNormalUsers(userCount);
    setmessage("simulation started...");

    const promises = users.map((u: User) =>
      joinRandomTableAndCreateOrders(u, restaurants, recipes)
    );

    // send all orders
    let start = new Date();
    const tablesToClose: {
      table: string;
      restaurant: string;
      orderCount: number;
    }[] = await Promise.all(promises);
    let time = new Date().getTime() - start.getTime();

    const totalOrders = tablesToClose.reduce(
      (curr, prev) => curr + prev.orderCount,
      0
    );

    console.log(`${totalOrders} orders issued in ${time / 1000} seconds`);
    setmessage(`${totalOrders} orders issued in ${time / 1000} seconds`);
    // close all the tables opened
    const promises2 = tablesToClose.map((tc) =>
      closeTable(tc.table, tc.restaurant)
    );
    start = new Date();
    await Promise.all(promises2);
    time = new Date().getTime() - start.getTime();
    enqueueSnackbar(`All tables closed in ${time / 1000} seconds`, {
      variant: "success",
    });

    // we don't mind having ordered recipes which are not in the menu
  };

  const startSimulation = async () => {
    // fetch a set of restaurant
    setmessage("fetching required datas...");
    const restaurants = await RestaurantApi.withMenuRestaurant(100);
    // fetch all "normal" users
    // fetch a set of recipes
    const recipes = await RecipeApi.sample(SIMULATOR_CONFIG.RECIPES);

    for (let i = 0; i < N.length; i++) {
      await fetchDatasForOrderGeneration(restaurants, recipes, N[i]);
    }
  };

  // store datas in mongo

  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
      Todo list
      <ul>
        <li>
          <b>Bulk Menu Generator</b>: Find all restaurants and Generate a random
          menu for all
          <Button onClick={startMenuGeneration}>Do it</Button>
        </li>

        <li>
          <b>Bulk Order Generator</b>:
          <br /> fetch all "normal" users
          <br /> fetch a set of restaurant
          <br /> fetch a set of recipes
          <br /> we don't mind having ordered recipes which are not in the menu
          <br /> take one user and join in a random table (1-30) of a random
          restaurant
          <br /> make 1-3 orders per user
          <Button onClick={startSimulation}>Do it</Button>
        </li>
      </ul>
      <h4>{message}</h4>
    </Container>
  );
}
