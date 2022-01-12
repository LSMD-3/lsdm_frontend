import React, { useEffect, useState } from "react";
import { Container, CssBaseline } from "@mui/material";

import { userState } from "redux/store";
import { useSelector } from "react-redux";
import UserHome from "./UserHome";
import ChefHome from "./ChefHome";
import WaiterHome from "./WaiterHome";
import AdminHome from "./AdminHome";
import SuperAdminHome from "./SuperAdminHome";

export default function Home() {
  const user = useSelector(userState);

  return (
    <Container>
      <CssBaseline />
      <h3>
        Welcome {user.user?.name} [{user.user?.userType}]
      </h3>
      {user.user?.userType === "user" && <UserHome />}
      {user.user?.userType === "chef" && <ChefHome />}
      {user.user?.userType === "waiter" && <WaiterHome />}
      {user.user?.userType === "admin" && <AdminHome />}
      {user.user?.userType === "super-admin" && <SuperAdminHome />}
    </Container>
  );
}
