import {
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Slider,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import { RestaurantApi, RecipeApi } from "api";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Category, Menu } from "types";
import { Box } from "@mui/system";

export default function RestaurantMenu() {
  let { restaurantId } = useParams();

  const [loading, setloading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [menu, setmenu] = useState<Menu>();
  const [categories, setcategories] = useState<Category[]>([]);
  const [percentages, setpercentages] = useState<number[]>([]);

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
    const data = new FormData(event.currentTarget);
    const total = data.get("total")?.toString();

    console.log(total);
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

  if (loading)
    return (
      <div className="center-loader">
        <CircularProgress />
      </div>
    );

  return (
    <div>
      <CssBaseline />
      <Container>
        {menu && <h1>beccati sto menu</h1>}
        {!menu && (
          <Container>
            <h1>This restaurant has not menu</h1>
            <h4>
              Menu creation is based on percentages provided of the above recipe
              types
            </h4>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
              onSubmit={createMenu}
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

              {categories.map((cat, i) => renderPercentage(cat.category, i))}
            </Box>
          </Container>
        )}
      </Container>
    </div>
  );
}
