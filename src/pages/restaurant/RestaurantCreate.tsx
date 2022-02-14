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
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Restaurant, User, UserType } from "types";

import StaffHandler from "./components/StaffHandler";

export default function RestaurantCreate() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [restaurant, setrestaurant] = useState<Restaurant>({
    _id: "",
    img_url: "",
    descrizione: "",
    tipologia: "",
    nome: "",
    comune: "",
    via: "",
    telefono: "",
    email: "",
    web: "",
    latitudine: "",
    longitudine: "",
    provincia: "",
    cap: "",
    tables_number: 30,
    menus: [],
    staff: {
      chefs: [],
      waiters: [],
      admins: [],
    },
  });

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

  const saveRestaurant = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (restaurant.nome.length === 0)
      return enqueueSnackbar("Please set a name for the restaurant", {
        variant: "error",
      });

    if (restaurant.email.length === 0)
      return enqueueSnackbar("Please set email for the restaurant", {
        variant: "error",
      });

    if (restaurant.tipologia.length === 0)
      return enqueueSnackbar("Please set activity type for the restaurant", {
        variant: "error",
      });

    try {
      // @ts-ignore
      restaurant._id = undefined;
      const res = await RestaurantApi.add(restaurant);
      enqueueSnackbar("Restaurant Created", { variant: "success" });
      navigate("/restaurants");
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

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
            <Box component="form" noValidate onSubmit={saveRestaurant}>
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
