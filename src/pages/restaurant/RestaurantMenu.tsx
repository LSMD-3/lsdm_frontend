import {
  Autocomplete,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { RestaurantApi, RecipeApi } from "api";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Category, Menu } from "types";
import { Box } from "@mui/system";
import { CardItem } from "components";

export default function RestaurantMenu() {
  let { restaurantId } = useParams();

  const [loading, setloading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [menu, setmenu] = useState<Menu>();
  const [categories, setcategories] = useState<Category[]>([]);
  const [percentages, setpercentages] = useState<number[]>([]);
  const [range, setrange] = useState<number[]>([19, 40]);
  const [searchFilter, setsearchFilter] = useState<string>();

  useEffect(() => {
    loadInitialData();
    return () => {};
  }, []);

  const loadInitialData = async () => {
    await Promise.all([fetchCategories(), fetchRestaurant()]);
    setloading(false);
  };

  const fetchCategories = async () => {
    try {
      const categories = await RecipeApi.getCategories();
      setcategories(categories);
      const percentages = new Array(categories.length);
      for (let i = 0; i < categories.length; i++) {
        percentages[i] = Math.trunc(Math.random() * 5) * 10;
      }

      setpercentages(percentages);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  const fetchRestaurant = async () => {
    if (restaurantId) {
      try {
        const menu = await RestaurantApi.getMenu(restaurantId);
        setmenu(menu);
      } catch (error: any) {
        enqueueSnackbar("Menu not found", { variant: "error" });
      }
    }
  };

  const createMenu = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!restaurantId) return;

    const data = new FormData(event.currentTarget);
    const totalRecipes = Number.parseInt(data.get("total")?.toString() ?? "0");

    const composition = categories.map((cat, i) => {
      return { category: cat.category, percentage: percentages[i] };
    });
    if (!restaurantId || !totalRecipes) return;

    try {
      const menu = await RestaurantApi.createMenu(restaurantId, {
        totalRecipes,
        composition,
        startPrice: range[0],
        endPrice: range[1],
      });
      setmenu(menu);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  const renderPercentage = (category: string, index: number) => {
    const percentage = percentages ? percentages[index] : undefined;
    return (
      <div key={category}>
        <h4>
          {category} {percentage ? percentage + "%" : ""}
        </h4>
        <Slider
          valueLabelDisplay="auto"
          step={10}
          marks
          min={0}
          max={100}
          id={category}
          value={percentage}
          style={{ maxWidth: 300 }}
          onChangeCommitted={(e, value) => {
            if (!percentages) return;
            percentages[index] = value as number;
            setpercentages([...percentages]);
          }}
        />
      </div>
    );
  };

  const handleChange = (event: Event, newrange: number | number[]) => {
    setrange(newrange as number[]);
  };

  if (loading)
    return (
      <div className="center-loader">
        <CircularProgress />
      </div>
    );

  const filteredRecipes = searchFilter
    ? menu?.recipes.filter(
        (r) => searchFilter && r.recipe.recipe_name.includes(searchFilter)
      )
    : menu?.recipes;

  return (
    <div>
      <CssBaseline />
      <Container>
        {menu && (
          <div>
            <Autocomplete
              id="search-recipe"
              freeSolo
              onChange={(event, value) => {
                console.log(event);
                value && setsearchFilter(value);
              }}
              options={menu.recipes.map((option) => option.recipe.recipe_name)}
              renderInput={(params) => (
                <TextField {...params} label="Search a recipe" />
              )}
              style={{ marginTop: 20 }}
            />
            <Grid
              container
              spacing={{ xs: 6, sm: 6, md: 3 }}
              columnGap={{ md: 6 }}
              columns={{ xs: 8, sm: 8, md: 12 }}
              justifyContent="center"
              style={{ marginTop: 40 }}
            >
              {filteredRecipes?.map((recipe) => (
                <Grid key={recipe.recipe._id} item xs={8} sm={8} md={4}>
                  <CardItem
                    text={recipe.recipe.recipe_name}
                    image={recipe.recipe.image_url}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
        )}

        {!menu && (
          <Container>
            <h1>This restaurant has not a menu</h1>
            <h4>
              Menu creation is based on percentages provided of the above recipe
              types.
            </h4>
            <h5>
              Creation is best effort, if the user ask for more recipes than
              available, will be created a menu with available recipes
            </h5>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={createMenu}
              style={{ marginTop: 40 }}
            >
              <TextField
                id="total"
                name="total"
                label="Number of recipes"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue={30}
              />

              <Button
                type="submit"
                variant="contained"
                style={{ marginTop: 20, marginLeft: 20 }}
              >
                Create a menu
              </Button>

              <div style={{ maxWidth: 400, marginTop: 40 }}>
                <Typography id="input-slider" gutterBottom>
                  Recipe price range: {range[0]}-{range[1]}€
                </Typography>
                <Slider
                  getAriaLabel={() => "Temperature range"}
                  value={range}
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                />
              </div>

              {categories.map((cat, i) => renderPercentage(cat.category, i))}
            </Box>
          </Container>
        )}
      </Container>
    </div>
  );
}
