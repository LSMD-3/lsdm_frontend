import { useState } from "react";
import { Container, Button, CssBaseline } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Category, Restaurant, User, Recipe, RecipeOrder } from "types";
import { SearchBar } from "components";
import {
  RecipeApi,
  RestaurantApi,
  UserApi,
  TableApi,
  MenuApi,
  UserGeneratorApi,
} from "api";
import { useSnackbar } from "notistack";

const SIMULATOR_CONFIG = {
  RECIPES: 5000,
  MAX_QUANTITY_OF_RECIPE: 4,
  MAX_QUANTITY_OF_ORDERS: 5,
  CLOSE_TABLES: true,
  JOIN_TABLE: true,
};

// 30k
const N = [200, 200, 200, 200, 200, 200, 200, 200, 200, 200];

interface RecipeGroup {
  _id: string;
  recipes: Recipe[];
}

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
      await MenuApi.createRandomMenu(restaurantId, {
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
    user: User,
    restaurant: Restaurant,
    tableId: string,
    recipes: Recipe[]
  ) => {
    const order: RecipeOrder[] = [];
    const recipeCount = getRandomNumberInRange(1, 6);

    for (let i = 0; i < recipeCount; i++) {
      const recipe = recipes[getRandomNumberInRange(0, recipes.length)];
      const row = {
        _id: recipe._id,
        ingredients: recipe.ingredients,
        recipe_name: recipe.recipe_name,
        image_url: recipe.image_url,
        price: recipe.price,
        qty: getRandomNumberInRange(1, SIMULATOR_CONFIG.MAX_QUANTITY_OF_RECIPE),
        status: "In preparation",
      };
      order.push(row);
    }

    try {
      await TableApi.submitOrder(restaurant, tableId, user, order);
      return true;
    } catch (error: any) {
      console.log(error);
      return false;
    }
  };

  const joinRandomTableAndCreateOrders = async (
    user: User,
    restaurants: Restaurant[]
  ) => {
    //BBBBBBBBBBB
    const myRestaurant =
      restaurants[getRandomNumberInRange(0, restaurants.length)];
    const myTable = getRandomNumberInRange(0, 30);
    console.log(myRestaurant);
    let failed;
    if (SIMULATOR_CONFIG.JOIN_TABLE)
      failed = await TableApi.joinTable(myRestaurant, "" + myTable, user);
    const orderCount = getRandomNumberInRange(
      1,
      SIMULATOR_CONFIG.MAX_QUANTITY_OF_ORDERS
    );
    if (!failed) {
      for (let i = 0; i < orderCount; i++) {
        await makeOrder(
          user,
          myRestaurant,
          "" + myTable,
          myRestaurant.menus[0].recipes
        );
      }

      return {
        table: "" + myTable,
        restaurant: myRestaurant,
        orderCount,
        status: "PASSED",
      };
    } else
      return {
        table: "" + myTable,
        restaurant: myRestaurant,
        orderCount,
        status: "FAILED",
      };
  };

  const closeTable = async (table: string, restaurant: Restaurant) => {
    if (SIMULATOR_CONFIG.CLOSE_TABLES)
      await TableApi.checkout_Table(restaurant, table);
  };

  const fetchDatasForOrderGeneration = async (
    restaurants: Restaurant[],
    userCount: number
  ) => {
    // fetch a set of restaurant
    const users = await UserApi.getNormalUsers(userCount);
    setmessage("simulation started...");

    const promises = users.map((u: User) => {
      try {
        return joinRandomTableAndCreateOrders(u, restaurants);
      } catch (e) {}
      return false;
    });

    // send all orders
    let start = new Date();
    const tablesToClose: {
      table: string;
      restaurant: Restaurant;
      orderCount: number;
      status: string;
    }[] = await Promise.all(promises);
    let time = new Date().getTime() - start.getTime();

    const totalOrders = tablesToClose.reduce(
      (curr, prev) => curr + prev.orderCount,
      0
    );

    console.log(`${totalOrders} orders issued in ${time / 1000} seconds`);
    setmessage(`${totalOrders} orders issued in ${time / 1000} seconds`);
    // close all the tables opened
    const promises2 = tablesToClose.map((tc) => {
      console.log(tc.status);
      if (tc.status === "PASSED") closeTable(tc.table, tc.restaurant);
    });
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
    const restaurants = await RestaurantApi.getLimited(200);

    for (let i = 0; i < N.length; i++) {
      await fetchDatasForOrderGeneration(restaurants, N[i]);
    }
  };

  const generateRandomFollows = async () => {
    const users = await UserApi.getNormalUsers(1000);
    users.forEach((user: User) => {
      UserGeneratorApi.generateRandomFollows(
        user._id,
        getRandomNumberInRange(0, 30)
      );
    });
  };

  const generateRandomRecipeLikes = async () => {
    const users = await UserApi.getNormalUsers(1000);
    users.forEach((user: User) => {
      UserGeneratorApi.generateRandomRecipeLikes(
        user._id,
        getRandomNumberInRange(0, 20)
      );
    });
  };

  const generateRandomRestaurantLikes = async () => {
    const users = await UserApi.getNormalUsers(1000);
    users.forEach((user: User) => {
      UserGeneratorApi.generateRandomRestaurantLikes(
        user._id,
        getRandomNumberInRange(0, 10)
      );
    });
  };
  // store datas in mongo

  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
      {message.length > 0 && (
        <Button onClick={() => setmessage("")}>Clear Message</Button>
      )}
      <ul>
        <li>
          <b>Bulk Menu Generator</b>: Find all restaurants and Generate a random
          menu for first 100 restaurants without menu
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
        <li>
          <b>Backup Restaurant from redis to Mongo</b>
          <Button
            onClick={async () => {
              try {
                await TableApi.backupFromRedis();
                enqueueSnackbar("Backup completed", { variant: "success" });
              } catch (error) {
                enqueueSnackbar("Backup failed", { variant: "error" });
              }
            }}
          >
            Do it
          </Button>
        </li>
        <li>
          <b>Generate a random number of random follows for 1000 users</b>
          <Button onClick={generateRandomFollows}>Do it</Button>
        </li>
        <li>
          <b>Generate a random number of random recipe like for 1000 users</b>
          <Button onClick={generateRandomRecipeLikes}>Do it</Button>
        </li>
        <li>
          <b>
            Generate a random number of random restaurant like for 1000 users
          </b>
          <Button onClick={generateRandomRestaurantLikes}>Do it</Button>
        </li>
        {/* <li>
          <b>Get Recipe Ranking</b>
          <Button
            onClick={async () => {
              try {
                const start = new Date();
                const res = await TableApi.recipeRanking(false);
                const time = new Date().getTime() - start.getTime();

                enqueueSnackbar(`Completed in ${time} ms`, {
                  variant: "success",
                });
              } catch (error) {
                enqueueSnackbar("Backup failed", { variant: "error" });
              }
            }}
          >
            Do it
          </Button>
        </li>

        <li>
          <b>Get User Ranking</b>
          <Button
            onClick={async () => {
              try {
                const start = new Date();
                const res = await TableApi.userRanking(false);
                const time = new Date().getTime() - start.getTime();

                enqueueSnackbar(`Completed in ${time} ms`, {
                  variant: "success",
                });
              } catch (error) {
                enqueueSnackbar("Backup failed", { variant: "error" });
              }
            }}
          >
            Do it
          </Button>
        </li>

        <li>
          <b>Get Restaurant Ranking</b>
          <Button
            onClick={async () => {
              try {
                const start = new Date();
                const res = await RestaurantApi.restaurantRanking("Piacenza");
                const time = new Date().getTime() - start.getTime();
                const message = res.map((r) => {
                  return `${r.nome}: ${r.avgPrice?.toFixed(2)}€`;
                });
                setmessage(
                  message.reduce((curr, acc) => curr + acc + "\n", "")
                );
                enqueueSnackbar(`Completed in ${time} ms`, {
                  variant: "success",
                });
              } catch (error) {
                enqueueSnackbar("Backup failed", { variant: "error" });
              }
            }}
          >
            Do it
          </Button>
        </li>

        <li>
          <b>Get Recipes by ingredient "salmone"</b>
          <Button
            onClick={async () => {
              try {
                const start = new Date();
                const res: RecipeGroup[] =
                  await RecipeApi.getRecipesByIngredient("salmone");
                const time = new Date().getTime() - start.getTime();

                let message = "";
                res.forEach((r) => {
                  message += "\n\n" + r._id + "\n";
                  r.recipes.forEach((recipe, i) => {
                    message +=
                      recipe.recipe_name +
                      (r.recipes.length - 1 === i ? "" : " - ");
                  });
                });

                setmessage(message);

                enqueueSnackbar(`Completed in ${time} ms`, {
                  variant: "success",
                });
              } catch (error) {
                enqueueSnackbar("Backup failed", { variant: "error" });
              }
            }}
          >
            Do it
          </Button>
        </li> */}
      </ul>
      <h4 style={{ whiteSpace: "pre-line" }}>{message}</h4>
    </Container>
  );
}
