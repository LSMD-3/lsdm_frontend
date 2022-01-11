import React, { useEffect, useState } from "react";
import { Container, Button, CssBaseline } from "@mui/material";

import { IS_DEV } from "../../config";

import Images from "assets/img/Images";
import { AuthenticationApi } from "api";
import store, { userState } from "redux/store";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import UserHome from "./UserHome";
import ChefHome from "./ChefHome";
import WaiterHome from "./WaiterHome";
import AdminHome from "./AdminHome";
import SuperAdminHome from "./SuperAdminHome";

export default function Home() {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector(userState);

  useEffect(() => {
    if (!IS_DEV) setTimeout(() => setOpen(true), 2000);
    return () => {};
  }, []);

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
