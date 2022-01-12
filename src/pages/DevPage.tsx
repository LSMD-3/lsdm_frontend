import { Button, Container, CssBaseline } from "@mui/material";
import { AuthenticationApi } from "api";
import { useSnackbar } from "notistack";
import React from "react";
import store from "redux/store";
import AppStore from "stores/AppStore";

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

export default function DevPage() {
  const { enqueueSnackbar } = useSnackbar();

  const fakeLogin = async (email: string, password: string) => {
    try {
      const user = await AuthenticationApi.login(email, password);
      store.dispatch({
        type: "user/login",
        payload: user,
      });
      AppStore.refreshNetworkIntializers();
      enqueueSnackbar("Login effettuato", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  return (
    <Container style={{ marginTop: 40 }}>
      <CssBaseline />
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
  );
}
