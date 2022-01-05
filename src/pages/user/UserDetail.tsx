import {
  TextField,
  Button,
  Container,
  CssBaseline,
  Grid,
  Typography,
  Switch,
} from "@mui/material";
import { Box } from "@mui/system";
import { UserApi } from "api";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "types";

export default function UserDetail() {
  let { userId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [user, setuser] = useState<User>();
  const [editable, seteditable] = useState(false);
  const [isMaster, setisMaster] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async () => {
    if (!userId) return;
    try {
      const user = await UserApi.find(userId);
      setuser(user);
      setisMaster(user.master);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  useEffect(() => {
    fetchUser();
    return () => {};
  }, []);

  const updateRestaurant = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!user) return;

    const name = data.get("name")?.toString() ?? user.name;
    const surname = data.get("surname")?.toString() ?? user.surname;
    const email = data.get("email")?.toString() ?? user.email;

    try {
      const res = await UserApi.update({
        ...user,
        name,
        surname,
        email,
        master: isMaster,
      });
      enqueueSnackbar("Utent Modificato", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  if (!userId) return <h1>User Not Found</h1>;

  // nome: string;
  // email: string;
  // descrizione: string;
  // tipologia: string;

  return (
    <div style={{ margin: 100 }}>
      {!editable && (
        <div>
          <code>{JSON.stringify(user, null, 2)}</code>
          <Button onClick={() => seteditable(true)}>Edit</Button>
        </div>
      )}
      {editable && (
        <div>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Edit User
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={updateRestaurant}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="name"
                      required
                      fullWidth
                      id="name"
                      label="First Name"
                      autoFocus
                      defaultValue={user?.name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="surname"
                      required
                      fullWidth
                      id="surname"
                      label="Last Name"
                      autoFocus
                      defaultValue={user?.name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      defaultValue={user?.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    Master
                    <Switch
                      id="email"
                      checked={isMaster}
                      onChange={() => setisMaster(!isMaster)}
                      aria-label="Master"
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Save User
                </Button>
              </Box>
            </Box>
          </Container>
        </div>
      )}
    </div>
  );
}
