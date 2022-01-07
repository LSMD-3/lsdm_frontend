import {
  TextField,
  Button,
  Container,
  CssBaseline,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Box } from "@mui/system";
import { RecipeApi } from "api";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Recipe } from "types";

export default function RecipeEdit() {
  let { recipeId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [recipe, setrecipe] = useState<Recipe>();

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
      enqueueSnackbar("Ricetta Modificata", { variant: "success" });
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

  return (
    <div style={{ margin: 100 }}>
      <div>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Edit Recipe
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={updateRecipe}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
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
                </Grid>
              </Grid>
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
      </div>
    </div>
  );
}
