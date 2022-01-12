import { RestaurantApi } from "api";

import { useEffect, useState } from "react";
import { Restaurant } from "types";
import { Container } from "@mui/material";
import { useSelector } from "react-redux";
import { cartState, userState } from "redux/store";
import { useSnackbar } from "notistack";

export default function RestaurantTable() {
  const [restaurant, setrestaurant] = useState<Restaurant>();
  const { enqueueSnackbar } = useSnackbar();
  const cart = useSelector(cartState);

  useEffect(() => {
    if (cart.joinedTable) fetchRestaurant(cart.joinedTable.restaurant._id);
    return () => {};
  }, []);

  const fetchRestaurant = async (restaurantId: string) => {
    try {
      const restaurant = await RestaurantApi.find(restaurantId);
      setrestaurant(restaurant);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  if (cart.joinedTable === undefined)
    return (
      <div>
        <h2>{"Table not found"}</h2>
      </div>
    );
  return (
    <Container>
      <h2 onClick={() => RestaurantApi.addOrder()} className="clickable">
        {" Table " + cart.joinedTable.tableNumber}
      </h2>
      <h3>Partecipants</h3>
      <h3>Menu here</h3>
    </Container>
  );
}
