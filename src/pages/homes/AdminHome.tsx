import { useState, useEffect } from "react";
import { Container, Button, CssBaseline } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Restaurant } from "types";
import { SearchBar } from "components";
import { RestaurantApi } from "api";
import { useSelector } from "react-redux";
import store, { userState } from "redux/store";
import { useSnackbar } from "notistack";

export default function AdminHome() {
  const navigate = useNavigate();
  const [selectedRestaurant, setselectedRestaurant] = useState<Restaurant>();
  const user = useSelector(userState);
  const { enqueueSnackbar } = useSnackbar();

  const joinedRestaurant = user.user?.joinedRestaurant;
  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
      {joinedRestaurant && <h2>My restaurant is {joinedRestaurant.nome}</h2>}
    </Container>
  );
}
