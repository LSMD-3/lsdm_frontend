import {
  TextField,
  Button,
  Container,
  CssBaseline,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Box } from "@mui/system";
import { RestaurantApi } from "api";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Restaurant, User, UserType } from "types";

import StaffHandler from "./components/StaffHandler";

export default function RestaurantEdit() {
  let { restaurantId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [restaurant, setrestaurant] = useState<Restaurant>();

  const updateStaff = (users: User[], type: UserType) => {
    if (!restaurant) return;
    switch (type) {
      case "admin":
        restaurant.staff.admins = users;
        break;
      case "chef":
        restaurant.staff.chefs = users;
        break;
      case "waiter":
        restaurant.staff.waiters = users;
        break;
    }

    setrestaurant({ ...restaurant });
  };

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
    const comune = data.get("comune")?.toString() ?? restaurant.descrizione;
    const type = data.get("type")?.toString() ?? restaurant.tipologia;

    try {
      const res = await RestaurantApi.update({
        ...restaurant,
        nome: name,
        email,
        comune: comune,
        tipologia: type,
      });
      enqueueSnackbar("Ristorante Modificato", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  if (!restaurantId) return <h1>Restaurant Not Found</h1>;

  if (!restaurant)
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
              Edit Restaurant
            </Typography>
            <Box component="form" noValidate onSubmit={updateRestaurant}>
              <TextField
                name="name"
                required
                fullWidth
                id="name"
                label="Restaurant Name"
                autoFocus
                value={restaurant.nome}
                onChange={(event) =>
                  setrestaurant({ ...restaurant, nome: event.target.value })
                }
                style={{ marginTop: 20 }}
              />

              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={restaurant.email}
                onChange={(event) =>
                  setrestaurant({
                    ...restaurant,
                    email: event.target.value,
                  })
                }
                style={{ marginTop: 20 }}
              />

              <TextField
                fullWidth
                id="comune"
                label="Comune"
                name="comune"
                autoComplete="text"
                value={restaurant.comune}
                onChange={(event) =>
                  setrestaurant({
                    ...restaurant,
                    comune: event.target.value,
                  })
                }
                style={{ marginTop: 20 }}
              />

              <TextField
                required
                fullWidth
                id="Type"
                label="Activity type"
                name="Type"
                autoComplete="Type"
                value={restaurant.tipologia}
                onChange={(event) =>
                  setrestaurant({
                    ...restaurant,
                    tipologia: event.target.value,
                  })
                }
                style={{ marginTop: 20 }}
              />

              <StaffHandler
                staffType="Admin"
                onUsersUpdate={(users) => updateStaff(users, "admin")}
                users={restaurant.staff.admins}
              />
              <StaffHandler
                staffType="Waiter"
                onUsersUpdate={(users) => updateStaff(users, "waiter")}
                users={restaurant.staff.waiters}
              />
              <StaffHandler
                staffType="Chef"
                onUsersUpdate={(users) => updateStaff(users, "chef")}
                users={restaurant.staff.chefs}
              />
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
    </div>
  );
}
