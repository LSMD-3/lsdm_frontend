import { useState } from "react";
import {
  Container,
  Button,
  CssBaseline,
  Tooltip,
  IconButton,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Restaurant } from "types";
import { Table } from "components";
import { RestaurantApi } from "api";
import { MenuBook } from "@mui/icons-material";
import { TableColumn } from "components/Table";
export default function UserHome() {
  const navigate = useNavigate();

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
  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
      <h2>Search a restaurant here</h2>
      <Table title="Restaurants" columns={columns} api={RestaurantApi} />
    </Container>
  );
}
