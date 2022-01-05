import {
  TextField,
  Button,
  Container,
  CssBaseline,
  Grid,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { RestaurantApi } from "api";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Restaurant } from "types";

export default function RestaurantDetail() {
  let { restaurantId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [restaurant, setrestaurant] = useState<Restaurant>();
  const [editable, seteditable] = useState(false);

  const navigate = useNavigate();

  const fetchRestaurant = async () => {
    if (!restaurantId) return;
    try {
      const restaurant = await RestaurantApi.find(restaurantId);
      setrestaurant(restaurant);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  useEffect(() => {
    fetchRestaurant();
    return () => {};
  }, []);

  const updateRestaurant = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!restaurant) return;

    const name = data.get("name")?.toString() ?? restaurant.nome;
    const email = data.get("email")?.toString() ?? restaurant.email;
    const description =
      data.get("description")?.toString() ?? restaurant.descrizione;
    const type = data.get("type")?.toString() ?? restaurant.tipologia;

    try {
      const res = await RestaurantApi.update({
        ...restaurant,
        nome: name,
        email,
        descrizione: description,
        tipologia: type,
      });
      enqueueSnackbar("Ristorante Modificato", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  if (!restaurantId) return <h1>Restaurant Not Found</h1>;

  // nome: string;
  // email: string;
  // descrizione: string;
  // tipologia: string;

  return (
    <div style={{ margin: 100 }}>
      {!editable && (
        <div>
          <code>{JSON.stringify(restaurant, null, 2)}</code>
          <Button onClick={() => seteditable(true)}>Edit</Button>
        </div>
      )}
      {editable && (
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
                Edit Restaurant
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={updateRestaurant}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="name"
                      required
                      fullWidth
                      id="name"
                      label="Restaurant Name"
                      autoFocus
                      defaultValue={restaurant?.nome}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      defaultValue={restaurant?.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="description"
                      label="Description"
                      name="description"
                      autoComplete="description"
                      defaultValue={restaurant?.descrizione}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="Type"
                      label="Activity type"
                      name="Type"
                      autoComplete="Type"
                      defaultValue={restaurant?.tipologia}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Save Restaurant
                </Button>
              </Box>
            </Box>
          </Container>
        </div>
      )}
    </div>
  );
}
