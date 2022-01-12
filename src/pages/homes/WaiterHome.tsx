import { useState, useEffect } from "react";
import { Container, Button, CssBaseline } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Restaurant } from "types";
import { SearchBar } from "components";
import { RestaurantApi } from "api";
import { useSelector } from "react-redux";
import store, { userState } from "redux/store";
import { useSnackbar } from "notistack";

export default function WaiterHome() {
  const navigate = useNavigate();
  const [selectedRestaurant, setselectedRestaurant] = useState<Restaurant>();
  const user = useSelector(userState);
  const { enqueueSnackbar } = useSnackbar();

  const joinRestaurant = async () => {
    if (!selectedRestaurant || !user.user) return;
    try {
      await RestaurantApi.addStaffMember(
        selectedRestaurant._id,
        user.user._id,
        "waiter"
      );
      store.dispatch({ type: "restaurant/join", payload: selectedRestaurant });
      enqueueSnackbar("Ristorante associato", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  const renderSearchRestaurant = () => {
    return (
      <div>
        <SearchBar<Restaurant>
          searchApi={(text) => RestaurantApi.searchRestaurantByName(text)}
          onSelectOption={(restaurant: Restaurant) =>
            setselectedRestaurant(restaurant)
          }
          keyExtractor={(rest) => rest._id}
          labelExtractor={(rest) => rest.nome}
        />

        <Button
          variant="contained"
          disabled={!selectedRestaurant}
          style={{ marginTop: 20 }}
          onClick={joinRestaurant}
        >
          Join Restaurant
        </Button>
      </div>
    );
  };

  const joinedRestaurant = user.user?.joinedRestaurant;
  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
      {!joinedRestaurant && (
        <div>
          <h2>Search a restaurant here</h2>
          {renderSearchRestaurant()}
        </div>
      )}
      {joinedRestaurant && <h2>My restaurant is {joinedRestaurant.nome}</h2>}
    </Container>
  );
}
