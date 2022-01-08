import { RestaurantApi } from "api";
import { CardItem, Table } from "components";
import { TableColumn } from "components/Table";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Restaurant } from "types";
import {
  Autocomplete,
  Container,
  CssBaseline,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { ModeEdit, MenuBook } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { userState } from "redux/store";
import { useSnackbar } from "notistack";
import { Box } from "@mui/system";

import { SpringModal, FlexBox, Footer } from "components";

export default function RestaurantTable() {
  let { restaurantId, tableId } = useParams();
  const [restaurant, setrestaurant] = useState<Restaurant>();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchRestaurant();
    return () => {};
  }, []);

  const fetchRestaurant = async () => {
    if (!restaurantId) return;
    try {
      const restaurant = await RestaurantApi.find(restaurantId);
      setrestaurant(restaurant);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  if (tableId === undefined)
    return (
      <div>
        <h2>{"Table not found"}</h2>
      </div>
    );
  return (
    <div>
      <h2>{"Table " + tableId}</h2>
      <Button onClick={() => RestaurantApi.addOrder()}>add order</Button>
    </div>
  );
}
