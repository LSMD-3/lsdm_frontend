import { UserApi } from "api";
import { Table } from "components";
import { TableColumn } from "components/Table";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "types";
import { useSnackbar } from "notistack";
import { Button, Container, CssBaseline } from "@mui/material";
import FakerFactory from "generators/faker";

export default function UserHome() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const columns: TableColumn[] = [
    { id: "name", label: "Nome" },
    { id: "surname", label: "Cognome" },
    { id: "email", label: "Email" },
    {
      id: "master",
      label: "Master",
      render: (master: boolean) => <p>{master ? "Yes" : "No"}</p>,
    },
  ];

  const openUserDetails = (user: User) => {
    navigate("/user/" + user._id);
  };

  const generateUsers = async (count: number) => {
    const users = FakerFactory.createUsers(count);
    const promises: any[] = [];
    users.forEach((user) => {
      promises.push(UserApi.add(user));
    });
    try {
      await Promise.all(promises);
      enqueueSnackbar(`${count} utenti creati`, { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
      <Button onClick={() => generateUsers(10)}>Generate Bulk 10</Button>
      <Button onClick={() => generateUsers(100)}>Generate Bulk 100</Button>
      <Button onClick={() => generateUsers(500)}>Generate Bulk 500</Button>
      <Table
        title="Users"
        columns={columns}
        onRowClick={openUserDetails}
        deleteApi={UserApi.delete}
        searchApi={UserApi.search}
        countApi={UserApi.count}
      />
    </Container>
  );
}
