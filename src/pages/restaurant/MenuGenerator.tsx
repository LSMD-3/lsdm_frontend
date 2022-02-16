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

import { RestaurantApi, RecipeApi, MenuApi } from "api";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Category, Menu } from "types";
import { Box } from "@mui/system";
import { CardItem } from "components";

export default function MenuGenerator() {
  let { restaurantId } = useParams();
  const [loading, setloading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setcategories] = useState<Category[]>([]);
  const [percentages, setpercentages] = useState<number[]>([]);
  const [range, setrange] = useState<number[]>([19, 40]);
  const navigate = useNavigate();
  useEffect(() => {
    loadInitialData();
    return () => {};
  }, []);

  const loadInitialData = async () => {
    await Promise.all([fetchCategories()]);
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

  const renderPercentage = (
    percentage: number,
    category: string,
    index: number
  ) => {
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
      const menu = await MenuApi.createRandomMenu(restaurantId, {
        totalRecipes,
        composition,
        startPrice: range[0],
        endPrice: range[1],
      });
      enqueueSnackbar("Menu Created!", { variant: "success" });
      navigate(`/restaurant/${restaurantId}/menu`);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  return (
    <Container>
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

        {percentages.length > 0 && (
          <div>
            {categories.map((cat, i) =>
              renderPercentage(percentages[i], cat.category, i)
            )}
          </div>
        )}
      </Box>
    </Container>
  );
}
