import React, { useEffect, useState } from "react";
import { CircularProgress, PaletteMode, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import {
  ExamplesPage,
  Home,
  NotFound,
  StoreCategorized,
  Profile,
  Signup,
  Signin,
  SimulatorHome,
  RestaurantsHome,
  RecipesHome,
  RestaurantEdit,
  RecipeEdit,
  UserEdit,
  UserOperation,
  RestaurantMenu,
  RestaurantLanding,
  RestaurantTable,
  DevPage,
  UserCart,
  RecipeCreate,
  RestaurantCreate,
  UserCreate,
  MenuGenerator,
} from "pages";
import { TopNavigation } from "navigation";

import { createTheme } from "@mui/material/styles";
import AppStore from "stores/AppStore";
import { useSelector } from "react-redux";
import { cartState, userState } from "redux/store";
import UsersHome from "pages/user/UsersHome";
import { getDesignTokens } from "styles/theme";

function App() {
  const [loading, setloading] = useState(true);
  const user = useSelector(userState);
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      },
    }),
    []
  );
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  const toggleColorMode = () => colorMode.toggleColorMode();

  useEffect(() => {
    loadInitialData();
    return () => {
      // component will unmount
    };
  }, []);

  const loadInitialData = async () => {
    await AppStore.loadInitialData();
    setloading(false);
  };

  if (loading)
    return (
      <CircularProgress
        style={{ position: "absolute", top: 200, right: "50%" }}
      />
    );

  let homeElement = <Home />;
  if (user.user?.joinedTable) {
    homeElement = <RestaurantTable />;
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={5}>
          <TopNavigation toggleColorMode={toggleColorMode} colorMode={mode} />
          <Routes>
            <Route path="/" element={homeElement} />
            <Route path="menu/:category" element={<StoreCategorized />} />
            <Route path="dev" element={<DevPage />} />
            <Route path="cart" element={<UserCart />} />
            <Route path="signup" element={<Signup />} />
            <Route path="signin" element={<Signin />} />
            <Route path="simulator" element={<SimulatorHome />} />
            <Route path="restaurants" element={<RestaurantsHome />} />
            <Route path="restaurant/create" element={<RestaurantCreate />} />
            <Route
              path="restaurant/:restaurantId/edit"
              element={<RestaurantEdit />}
            />
            <Route
              path="restaurant/:restaurantId/menu"
              element={<RestaurantMenu />}
            />

            <Route
              path="restaurant/:restaurantId/menugenerator"
              element={<MenuGenerator />}
            />

            <Route
              path="restaurant/:restaurantId"
              element={<RestaurantLanding />}
            />
            <Route path="users" element={<UsersHome />} />
            <Route path="user/create" element={<UserCreate />} />
            <Route path="user/:userId/edit" element={<UserEdit />} />
            <Route path="user/:userId" element={<UserOperation />} />
            <Route path="recipes" element={<RecipesHome />} />
            <Route path="recipe/create" element={<RecipeCreate />} />
            <Route path="recipe/:recipeId/edit" element={<RecipeEdit />} />
            <Route
              path="profile"
              element={user.authenticated ? <Profile /> : <Signup />}
            />
            <Route path="examples" element={<ExamplesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SnackbarProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
