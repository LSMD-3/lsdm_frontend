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

export default function RecipeEdit() {
  let { recipeId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [recipe, setrecipe] = useState<Recipe>();
  const [open, setopen] = useState(false);

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

  const navigate = useNavigate();

  const fetchRecipe = async () => {
    if (!recipeId) return;
    try {
      const recipe = await RecipeApi.find(recipeId);
      setrecipe(recipe);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  useEffect(() => {
    fetchRecipe();
    return () => {};
  }, []);

  const updateRecipe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!recipe) return;

    const recipe_name =
      data.get("recipe_name")?.toString() ?? recipe.recipe_name;

    try {
      const res = await RecipeApi.update({
        ...recipe,
        recipe_name: recipe_name,
      });
      enqueueSnackbar("Recipe Edited", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  if (!recipeId) return <h1>Recipe Not Found</h1>;

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
          Edit Recipe
        </Typography>
        <Box component="form" noValidate onSubmit={updateRecipe} sx={{ mt: 3 }}>
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
