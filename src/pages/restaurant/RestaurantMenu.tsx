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

import { RestaurantApi, RecipeApi } from "api";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Category, Recipe, MenuRecipe, Restaurant } from "types";
import { Box } from "@mui/system";
import { RecipeCard, SearchRecipeModal } from "components";
import { userState } from "redux/store";
import { useSelector } from "react-redux";

export default function RestaurantMenu() {
  let { restaurantId } = useParams();
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedMenu, setselectedMenu] = useState(0);
  const [restaurant, setrestaurant] = useState<Restaurant>();
  const [deleteRecipesMode, setdeleteRecipesMode] = useState(false);
  const [newRecipes, setnewRecipes] = useState<MenuRecipe[]>();
  const [recipeModalOpened, setrecipeModalOpened] = useState(false);
  const [editMenuInfoMode, seteditMenuInfoMode] = useState(false);
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
    if (!restaurant) return;
    restaurant.menus[selectedMenu].recipes.push(recipe);

    try {
      await RestaurantApi.update(restaurant);
      setrestaurant({ ...restaurant });
      enqueueSnackbar("Recipes updated!", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar("Menu not found", { variant: "error" });
    }
    setrecipeModalOpened(false);
  };

  const removeRecipe = (index: number) => {
    if (!newRecipes) return;
    newRecipes.splice(index, 1);

    setnewRecipes([...newRecipes]);
  };

  const persistRecipesRemoved = async () => {
    if (!restaurant) return;
    restaurant.menus[selectedMenu].recipes = newRecipes!;

    try {
      await RestaurantApi.update(restaurant);
      setrestaurant({ ...restaurant });
      enqueueSnackbar("Recipes updated!", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar("Menu not found", { variant: "error" });
    }
    setdeleteRecipesMode(false);
  };

  const deleteCurrentMenu = async () => {
    if (!restaurant) return;
    restaurant.menus.splice(selectedMenu, 1);
    try {
      await RestaurantApi.update(restaurant);
      setrestaurant({ ...restaurant });
      enqueueSnackbar("Menu removed!", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar("Menu not found", { variant: "error" });
    }
    setdeleteRecipesMode(false);
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
    const recipes = deleteRecipesMode
      ? newRecipes!
      : restaurant.menus[selectedMenu].recipes;

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
            <Button onClick={() => seteditMenuInfoMode(true)}>
              Edit Menu Informations
            </Button>
            <Button
              onClick={() => {
                setnewRecipes(restaurant.menus[selectedMenu].recipes);
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
        <Button
          onClick={() => navigate(`/restaurant/${restaurantId}/menugenerator`)}
          variant="contained"
          style={{ margin: 20, float: "right" }}
        >
          Generate New Menu
        </Button>
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
                        deleteRecipesMode ? () => removeRecipe(i) : undefined
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
      </Container>
    </div>
  );
}
