import { useState, useEffect } from "react";
import { Container, Button, CssBaseline } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Restaurant } from "types";
import { RestaurantApi } from "api";
import { useSelector } from "react-redux";
import store, { userState } from "redux/store";
import { useSnackbar } from "notistack";

export default function AdminHome() {
  const navigate = useNavigate();
  const user = useSelector(userState);
  const [myRestaurant, setmyRestaurant] = useState<Restaurant>();

  const { enqueueSnackbar } = useSnackbar();
  const myRestaurantId = user.user?.joinedRestaurant?._id;

  const fetchMyRestaurant = async () => {
    if (myRestaurantId) {
      try {
        const restaurant = await RestaurantApi.find(myRestaurantId);
        setmyRestaurant(restaurant);
      } catch (error) {
        enqueueSnackbar("restaurant not found", { variant: "error" });
      }
    }
  };

  useEffect(() => {
    fetchMyRestaurant();

    return () => {};
  }, []);

  const joinedRestaurant = user.user?.joinedRestaurant;
  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />

      {user.user?.userType !== "super-admin" && myRestaurant && (
        <div>
          <h2>{myRestaurant.nome}</h2>
          <span>
            {myRestaurant.email} - {myRestaurant.tipologia} -{" "}
            {myRestaurant.comune}
          </span>
          <div style={{ marginTop: 30 }}>
            <Button
              variant="contained"
              onClick={() => navigate(`/restaurant/${myRestaurant._id}/edit`)}
            >
              Edit Restaurant
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate(`/restaurant/${myRestaurant._id}/menu`)}
              style={{ marginLeft: 20 }}
            >
              Open Menu
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}
