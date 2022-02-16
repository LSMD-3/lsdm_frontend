import {
  Autocomplete,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import { RestaurantApi, RecipeApi, MenuApi } from "api";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Category, Recipe, MenuRecipe, Restaurant } from "types";
import { Box } from "@mui/system";
import { RecipeCard, SearchRecipeModal } from "components";
import { userState } from "redux/store";
import { useSelector } from "react-redux";
import CreateMenuModal from "components/dialogs/CreateMenuModal";

export default function RestaurantMenu() {
  let { restaurantId } = useParams();
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedMenu, setselectedMenu] = useState(0);
  const [restaurant, setrestaurant] = useState<Restaurant>();
  const [deleteRecipesMode, setdeleteRecipesMode] = useState(false);
  const [recipeModalOpened, setrecipeModalOpened] = useState(false);
  const [editMenuInfoMode, seteditMenuInfoMode] = useState(false);
  const [createMenuOpen, setcreateMenuOpen] = useState(false);
  const [recipesToRemove, setrecipesToRemove] = useState<string[]>([]);
  const user = useSelector(userState);

  const [searchFilter, setsearchFilter] = useState<string>();

  useEffect(() => {
    loadInitialData();
    return () => {};
  }, []);

  const loadInitialData = async () => {
    await fetchRestaurant();
    setloading(false);
  };

  const fetchRestaurant = async () => {
    if (restaurantId) {
      try {
        const restaurant = await RestaurantApi.find(restaurantId);
        setrestaurant(restaurant);
      } catch (error: any) {
        enqueueSnackbar("Menu not found", { variant: "error" });
      }
    }
  };

  const addRecipeToMenu = async (recipe: MenuRecipe) => {
    if (!restaurantId) return;
    try {
      await MenuApi.addRecipeToMenu(restaurantId, selectedMenu, recipe);
      await fetchRestaurant();
      enqueueSnackbar("Recipes added!", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar("Menu not found", { variant: "error" });
    }
    setrecipeModalOpened(false);
  };

  const persistRecipesRemoved = async () => {
    if (!restaurantId || !restaurant) return;

    restaurant.menus[selectedMenu].recipes = restaurant.menus[
      selectedMenu
    ].recipes.filter((r) => !recipesToRemove.includes(r._id));
    try {
      await MenuApi.removeRecipesFromMenu(
        restaurantId,
        selectedMenu,
        recipesToRemove
      );
      setrestaurant({ ...restaurant });
      enqueueSnackbar("Recipes updated!", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar("Menu not found", { variant: "error" });
    }
    setdeleteRecipesMode(false);
  };

  const deleteCurrentMenu = async () => {
    if (!restaurantId) return;
    try {
      await MenuApi.deleteMenu(restaurantId, selectedMenu);
      setselectedMenu(0);
      await fetchRestaurant();
      enqueueSnackbar("Menu removed!", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar("Menu not found", { variant: "error" });
    }
    setdeleteRecipesMode(false);
  };

  const createNewMenu = async (name: string, ayce: boolean, price?: number) => {
    if (!restaurantId) return;
    try {
      await MenuApi.createMenu(restaurantId, {
        ayce,
        name,
        price,
        recipes: [],
      });
      await fetchRestaurant();
      enqueueSnackbar("Menu Created!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Menu creation failed", { variant: "error" });
    }
    setcreateMenuOpen(false);
  };

  if (loading)
    return (
      <div className="center-loader">
        <CircularProgress />
      </div>
    );

  if (!restaurant)
    return (
      <div className="center-loader">
        <h1>Restaurant Not Found</h1>
      </div>
    );

  let filteredRecipes: MenuRecipe[] = [];
  const hasMenus = restaurant.menus.length > 0;

  if (hasMenus) {
    const recipes = restaurant.menus[selectedMenu].recipes.filter(
      (r) => !recipesToRemove.includes(r._id)
    );

    filteredRecipes = searchFilter
      ? recipes.filter(
          (r) => searchFilter && r.recipe_name.includes(searchFilter)
        )
      : recipes;
  }

  const renderEditorTools = () => {
    return (
      <div>
        <h4>Actions</h4>
        {deleteRecipesMode && (
          <Button onClick={persistRecipesRemoved}>
            Exit Delete Mode and Save
          </Button>
        )}
        {!deleteRecipesMode && !editMenuInfoMode && (
          <div>
            <Button onClick={() => setrecipeModalOpened(true)}>
              Add a Recipe
            </Button>
            <Button
              onClick={() =>
                navigate(`/recipe/create/${restaurantId}/${selectedMenu}`)
              }
            >
              Add a new Recipe
            </Button>
            {/* <Button onClick={() => seteditMenuInfoMode(true)}>
              Edit Menu Informations
            </Button> */}
            <Button
              onClick={() => {
                setdeleteRecipesMode(true);
              }}
              color="error"
            >
              Remove Recipes
            </Button>
            <Button onClick={deleteCurrentMenu} color="error">
              Delete Selected Menu
            </Button>
          </div>
        )}
      </div>
    );
  };

  const isAdmin =
    user.user?.userType === "admin" || user.user?.userType === "super-admin";
  return (
    <div>
      <CssBaseline />
      {isAdmin && (
        <div style={{ margin: 20, float: "right" }}>
          <Button
            onClick={() =>
              navigate(`/restaurant/${restaurantId}/menugenerator`)
            }
            variant="contained"
            style={{ marginRight: 20 }}
          >
            Generate New Menu
          </Button>
          <Button onClick={() => setcreateMenuOpen(true)} variant="contained">
            Create a menu
          </Button>
        </div>
      )}
      <Container>
        {!hasMenus && (
          <div>
            <h1>This restaurant has not a menu</h1>
          </div>
        )}
        {hasMenus && (
          <div>
            <h2>Available Menus</h2>
            {!deleteRecipesMode &&
              restaurant.menus.map((m, i) => (
                <Button
                  variant={i === selectedMenu ? "contained" : "outlined"}
                  onClick={() => setselectedMenu(i)}
                  style={{ margin: 20 }}
                >
                  {m.name}
                </Button>
              ))}
            {!editMenuInfoMode && (
              <h4>
                {restaurant.menus[selectedMenu].name}
                {restaurant.menus[selectedMenu].ayce
                  ? ` - AYCE ${restaurant.menus[selectedMenu].price}€`
                  : " - A la carte"}
              </h4>
            )}
            {isAdmin && renderEditorTools()}
            {!isAdmin && (
              <Button
                variant="contained"
                onClick={() => navigate("/restaurant/" + restaurantId)}
              >
                Open Restaurant
              </Button>
            )}
            <div>
              <Autocomplete
                id="search-recipe"
                freeSolo
                onChange={(event, value) => {
                  setsearchFilter(value ? value : undefined);
                }}
                options={restaurant.menus[selectedMenu].recipes.map(
                  (option) => option.recipe_name
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Search a recipe" />
                )}
                style={{ marginTop: 20 }}
              />
              <Grid
                container
                spacing={{ xs: 6, sm: 6, md: 3 }}
                columns={{ xs: 8, sm: 8, md: 12 }}
                justifyContent="center"
                style={{ marginTop: 40 }}
              >
                {filteredRecipes?.map((recipe, i) => (
                  <Grid key={recipe._id} item xs={8} sm={8} md={4}>
                    <RecipeCard
                      recipe={recipe}
                      onClick={
                        deleteRecipesMode
                          ? () =>
                              setrecipesToRemove(
                                recipesToRemove.concat(recipe._id)
                              )
                          : undefined
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </div>
          </div>
        )}
        <SearchRecipeModal
          open={recipeModalOpened}
          onClose={() => setrecipeModalOpened(false)}
          onRecipeAdded={addRecipeToMenu}
          title="Search a recipe to add"
        />
        <CreateMenuModal
          onConfirm={createNewMenu}
          open={createMenuOpen}
          handleClose={() => setcreateMenuOpen(false)}
        ></CreateMenuModal>
      </Container>
    </div>
  );
}
