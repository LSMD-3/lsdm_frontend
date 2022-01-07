import { RestaurantApi } from "api";
import { Table } from "components";
import { TableColumn } from "components/Table";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Restaurant } from "types";
import { Container, CssBaseline, IconButton, Tooltip } from "@mui/material";
import { ModeEdit, MenuBook } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { userState } from "redux/store";

export default function RestaurantsHome() {
  const navigate = useNavigate();

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
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
    </Container>
  );
}
