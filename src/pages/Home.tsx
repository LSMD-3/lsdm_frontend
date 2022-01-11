import React, { useEffect, useState } from "react";
import {
  TextField,
  Container,
  Grid,
  Box,
  Button,
  CssBaseline,
} from "@mui/material";
import { SpringModal, FlexBox, Footer, CardItem } from "components";

import { IS_DEV } from "../config";

import Images from "assets/img/Images";
import { AuthenticationApi } from "api";
import store from "redux/store";
import { useSnackbar } from "notistack";

const userAccounts = [
  {
    name: "User Mario Rossi",
    email: "mario.rossi@gmail.com",
    password: "Mariorossi1!",
  },
  {
    name: "Chef Tony Bianchi",
    email: "tony.bianchi@gmail.com",
    password: "Tonybianchi1!",
  },
  {
    name: "Waiter Marco Gentile",
    email: "marco.gentile@gmail.com",
    password: "Marcogentile1!",
  },
  {
    name: "Admin Luca Verdi",
    email: "luca.verdi@gmail.com",
    password: "Lucaverdi1!",
  },
];

export default function Home() {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  let email = "";

  useEffect(() => {
    if (!IS_DEV) setTimeout(() => setOpen(true), 2000);
    return () => {};
  }, []);

  const onConfirmSubscription = () => {
    console.log("subscription confirmed for " + email);
    setOpen(false);
  };

  const fakeLogin = async (email: string, password: string) => {
    try {
      const user = await AuthenticationApi.login(email, password);
      store.dispatch({
        type: "user/login",
        payload: user,
      });
      enqueueSnackbar("Login effettuato", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  const renderMenu = () => (
    <Box sx={{ flexGrow: 1 }} style={{ marginTop: 50 }}>
      <Grid
        container
        spacing={{ xs: 6, sm: 6, md: 3 }}
        columnGap={{ md: 6 }}
        columns={{ xs: 8, sm: 8, md: 12 }}
        justifyContent="center"
      >
        <Grid item xs={6} sm={6} md={3}>
          <CardItem image={Images.image1} text={"EXAMPLES"} url={"/examples"} />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <CardItem image={Images.image2} text={"PROFILE"} url={"/profile"} />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <CardItem image={Images.image3} text={"STORE"} url={"/menu"} />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <div>
      <CssBaseline />
      {renderMenu()}
      <Container style={{ marginTop: 40 }}>
        <h3>Join with</h3>
        {userAccounts.map((user) => {
          return (
            <Button
              onClick={() => fakeLogin(user.email, user.password)}
              variant="contained"
              style={{ marginRight: 20 }}
            >
              {user.name}
            </Button>
          );
        })}
      </Container>
    </div>
  );
}
