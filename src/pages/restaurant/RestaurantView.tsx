import {
  TextField,
  Button,
  Container,
  CssBaseline,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Box } from "@mui/system";
import { RestaurantApi, TableApi } from "api";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Restaurant, User, UserType } from "types";

import StaffHandler from "./components/StaffHandler";

export default function RestaurantView() {
  let { restaurantId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [restaurant, setrestaurant] = useState<Restaurant>();
  const [revenue, setrevenue] = useState<number>();

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

  const fetchRevenue = async () => {
    if (!restaurantId) return;
    try {
      const revenue = await TableApi.getRestaurantRevenue(restaurantId);
      setrevenue(revenue[0].total_revenue);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  useEffect(() => {
    fetchRestaurant();
    fetchRevenue();
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
            <Typography style={{ marginTop: 20 }} component="h1" variant="h5">
              {restaurant.nome}
            </Typography>
            <Typography style={{ marginTop: 20 }} component="h3" variant="h5">
              Total Revenue: {revenue}€
            </Typography>
            <Typography style={{ marginTop: 20 }} component="h3" variant="h5">
              Email:{restaurant.email}
            </Typography>
            <Typography style={{ marginTop: 20 }} component="h3" variant="h5">
              Comune: {restaurant.comune}
            </Typography>
            <Typography style={{ marginTop: 20 }} component="h3" variant="h5">
              Tipologia: {restaurant.tipologia}
            </Typography>
            <StaffHandler
              staffType="Admin"
              onUsersUpdate={(users) => updateStaff(users, "admin")}
              viewOnly
              users={restaurant.staff.admins}
            />
            <StaffHandler
              staffType="Waiter"
              onUsersUpdate={(users) => updateStaff(users, "waiter")}
              viewOnly
              users={restaurant.staff.waiters}
            />
            <StaffHandler
              staffType="Chef"
              onUsersUpdate={(users) => updateStaff(users, "chef")}
              viewOnly
              users={restaurant.staff.chefs}
            />
          </Box>
        </Container>
      </div>
    </div>
  );
}
