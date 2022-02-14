import { RestaurantApi, TableApi } from "api";
import { DialogManager, Table } from "components";
import { TableColumn } from "components/Table";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  CssBaseline,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ModeEdit, MenuBook } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { userState } from "redux/store";
import { useSnackbar } from "notistack";

export default function RestaurantsHome() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const user = useSelector(userState);

  const columns: TableColumn[] = [
    { id: "nome", label: "Nome" },
    { id: "tipologia", label: "Tipologia" },
    { id: "email", label: "Email" },
    { id: "comune", label: "Comune" },
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

  const renderSuperAdmin = () => (
    <Table title="Restaurants" columns={columns} api={RestaurantApi} />
  );

  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <Button
        onClick={() => navigate("/restaurant/create")}
        variant="contained"
        style={{ marginBottom: 20 }}
      >
        Create Restaurant
      </Button>
      <CssBaseline />
      {user.user?.userType === "super-admin" && renderSuperAdmin()}
    </Container>
  );
}
