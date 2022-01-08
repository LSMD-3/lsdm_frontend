import { RestaurantApi } from "api";
import { Table } from "components";
import { TableColumn } from "components/Table";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Restaurant } from "types";
import {
  Autocomplete,
  Container,
  CssBaseline,
  IconButton,
  Tooltip,
  TextField,
  Button,
} from "@mui/material";
import { ModeEdit, MenuBook } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { userState } from "redux/store";
import { useSnackbar } from "notistack";

export default function RestaurantsHome() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [searchText, setsearchText] = useState<string>();
  const [restaurants, setrestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setselectedRestaurant] = useState<Restaurant>();

  const fetchOptions = async () => {
    if (!searchText || searchText.length === 0) return;
    try {
      const restaurants = await RestaurantApi.searchRestaurantByName(
        searchText
      );
      if (restaurants) setrestaurants(restaurants);
      else setrestaurants([]);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  useEffect(() => {
    fetchOptions();
    return () => {};
  }, [searchText]);

  const user = useSelector(userState);

  const columns: TableColumn[] = [
    { id: "nome", label: "Nome" },
    { id: "tipologia", label: "Tipologia" },
    { id: "email", label: "Email" },
    { id: "comune", label: "Comune" },
    { id: "provincia", label: "Provincia" },
    {
      id: "actions",
      label: "Actions",
      render: (data: { _id: string }) => {
        const { _id } = data;
        console.log(data);
        return (
          <div>
            <Tooltip
              title="edit restaurant"
              onClick={() => navigate(`/restaurant/${_id}/edit`)}
            >
              <IconButton>
                <ModeEdit />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="open menu"
              onClick={() => navigate(`/restaurant/${_id}/menu`)}
            >
              <IconButton>
                <MenuBook />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  if (user.user?.userType === "super-admin")
    return (
      <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
        <CssBaseline />
        <Table title="Restaurants" columns={columns} api={RestaurantApi} />
      </Container>
    );

  if (user.user?.userType === "user") {
    return (
      <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
        <CssBaseline />
        <h3>TODO search restaurant for user</h3>
        <h3>Favourite Restaurant</h3>
        <h3>Favourite Recepies</h3>
        <Autocomplete
          options={restaurants}
          value={selectedRestaurant}
          onChange={(event: any, newValue: Restaurant | null) => {
            if (newValue) setselectedRestaurant(newValue);
          }}
          inputValue={searchText}
          onInputChange={(event, newInputValue) => {
            setsearchText(newInputValue);
          }}
          id="controllable-states-demo"
          sx={{ width: 300 }}
          renderOption={(props, rest) => (
            <span key={rest?._id} {...props}>
              {rest?.nome}
            </span>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Controllable" />
          )}
        />

        <Button
          variant="contained"
          disabled={!selectedRestaurant}
          onClick={() => navigate("/restaurant/" + selectedRestaurant!._id)}
        >
          <p>GO</p>
        </Button>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
    </Container>
  );
}
