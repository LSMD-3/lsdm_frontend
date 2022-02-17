import {
  TextField,
  Button,
  Container,
  CssBaseline,
  Grid,
  Typography,
  CircularProgress,
  List,
  ListItem,
  IconButton,
  ListItemText,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import { RecipeApi } from "api";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Recipe } from "types";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { FormDialog } from "components";

export default function RecipeCreate() {
  let { restaurantId } = useParams();
  let { menuNumber } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [recipe, setrecipe] = useState<Recipe>({
    _id: "string",
    recipe_name: "",
    ingredients: [],
  });
  const [open, setopen] = useState(false);
  const navigate = useNavigate();

  const [selectedIngredient, setselectedIngredient] = useState<number>();
  const [ingredientName, setingredientName] = useState("");

  const openUpdateIngredient = (ingredient: number) => {
    setselectedIngredient(ingredient);
    setingredientName(recipe!.ingredients[ingredient]);
    setopen(true);
  };

  const openAddIngredient = () => {
    setopen(true);
  };

  const addIngredient = (newValue: string) => {
    if (!recipe || !newValue) return;
    recipe.ingredients.push(newValue);
    setrecipe({ ...recipe });
    setopen(false);
  };

  const updateIngredient = (newValue: string) => {
    if (selectedIngredient === undefined || !recipe) return;
    recipe.ingredients[selectedIngredient] = newValue;
    setrecipe({ ...recipe });
    setselectedIngredient(undefined);
    setopen(false);
  };

  const deleteIngredient = (index: number) => {
    if (!recipe) return;
    recipe.ingredients.splice(index, 1);
    setrecipe({ ...recipe });
  };

  const saveRecipe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!recipe.recipe_name)
      return enqueueSnackbar("Please set recipe name", { variant: "error" });

    try {
      // @ts-ignore
      recipe._id = undefined;
      const res = await RecipeApi.add(recipe);
      enqueueSnackbar("Recipe Created", { variant: "success" });
      if (restaurantId) {
        navigate(`/restaurant/${restaurantId}/menu`);
      } else navigate("/recipes");
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  // nome: string;
  // email: string;
  // descrizione: string;
  // tipologia: string;

  if (!recipe)
    return (
      <div className="center-loader">
        <CircularProgress />
      </div>
    );

  const Demo = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));

  return (
    <Container
      component="main"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          flexDirection: "column",
          flex: 1,
          maxWidth: 500,
        }}
      >
        <Typography component="h1" variant="h5">
          Create Recipe
        </Typography>
        <Box component="form" noValidate onSubmit={saveRecipe} sx={{ mt: 3 }}>
          <TextField
            name="name"
            required
            fullWidth
            id="name"
            label="Recipe Name"
            autoFocus
            value={recipe.recipe_name}
            onChange={(event) =>
              setrecipe({ ...recipe, recipe_name: event.target.value })
            }
          />
          <TextField
            name="image_url"
            required
            fullWidth
            id="image_url"
            label="Image Url"
            autoFocus
            value={recipe.image_url}
            onChange={(event) =>
              setrecipe({ ...recipe, image_url: event.target.value })
            }
            style={{ marginTop: 20 }}
          />

          {recipe.image_url && (
            <img src={recipe.image_url} alt="img preview" width={"100%"}></img>
          )}

          <Grid>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 30,
              }}
            >
              <Typography variant="h6" component="div">
                Ingredients
              </Typography>
              <Button variant="contained" onClick={openAddIngredient}>
                Add Ingredient
              </Button>
            </div>
            <Demo>
              <List dense={true}>
                {recipe.ingredients.map((ingredient, idx) => (
                  <ListItem
                    key={ingredient}
                    secondaryAction={
                      <div>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => openUpdateIngredient(idx)}
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => deleteIngredient(idx)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    }
                  >
                    <ListItemText primary={ingredient} />
                  </ListItem>
                ))}
              </List>
            </Demo>
          </Grid>
          <FormDialog
            open={open}
            handleClose={() => setopen(false)}
            dialogProps={{
              title: selectedIngredient
                ? "Update ingredient"
                : "Add Ingredient",
              defaultValue: ingredientName,
              onConfirm: selectedIngredient ? updateIngredient : addIngredient,
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Save Recipe
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
