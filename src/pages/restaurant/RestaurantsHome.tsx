import { RestaurantApi } from "api";
import { Table } from "components";
import { TableColumn } from "components/Table";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Restaurant } from "types";
import { useSnackbar } from "notistack";
import { Container, CssBaseline } from "@mui/material";

export default function RestaurantsHome() {
  const navigate = useNavigate();

  const columns: TableColumn[] = [
    { id: "nome", label: "Nome" },
    { id: "tipologia", label: "Tipologia" },
    { id: "email", label: "Email" },
    { id: "comune", label: "Comune" },
    { id: "provincia", label: "Provincia" },
  ];

  const openRestaurantDetails = (restaurant: Restaurant) => {
    navigate("/restaurant/" + restaurant._id);
  };

  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
      <Table
        title="Restaurants"
        columns={columns}
        onRowClick={openRestaurantDetails}
        deleteApi={RestaurantApi.delete}
        searchApi={RestaurantApi.search}
        countApi={RestaurantApi.count}
      />
    </Container>
  );
}
