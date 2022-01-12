import { useState } from "react";
import { Container, Button, CssBaseline } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Restaurant } from "types";
import { SearchBar } from "components";
import { RestaurantApi } from "api";
export default function UserHome() {
  const navigate = useNavigate();
  const [selectedRestaurant, setselectedRestaurant] = useState<Restaurant>();
  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
      <h2>Search a restaurant here</h2>
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
        onClick={() => navigate("/restaurant/" + selectedRestaurant!._id)}
      >
        Open Restaurant
      </Button>
    </Container>
  );
}
