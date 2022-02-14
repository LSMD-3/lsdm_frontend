import {
  TextField,
  Button,
  Container,
  CssBaseline,
  Grid,
  Typography,
  CircularProgress,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Box } from "@mui/system";
import { AuthenticationApi } from "api";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, UserType } from "types";

export default function UserCreate() {
  let { userId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [user, setuser] = useState<User>({
    _id: "",
    email: "",
    name: "",
    surname: "",
    accessToken: "",
    refreshToken: "",
    userType: "user",
  });
  const navigate = useNavigate();

  const createUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user.name.length === 0)
      return enqueueSnackbar("Please set a name for the user", {
        variant: "error",
      });

    if (user.surname.length === 0)
      return enqueueSnackbar("Please set surname for the user", {
        variant: "error",
      });

    if (user.email.length === 0)
      return enqueueSnackbar("Please set email for the user", {
        variant: "error",
      });

    try {
      await AuthenticationApi.signup(
        user.email!,
        "Password1!",
        user.name!,
        user.surname!
      );
      enqueueSnackbar("User Created", { variant: "success" });
      navigate("/users");
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };
  return (
    <div style={{ margin: 100 }}>
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
              onSubmit={createUser}
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
                    value={user?.name}
                    onChange={(event) =>
                      setuser({ ...user, name: event.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="surname"
                    required
                    fullWidth
                    id="surname"
                    label="Last Name"
                    value={user?.surname}
                    onChange={(event) =>
                      setuser({ ...user, surname: event.target.value })
                    }
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
                    value={user?.email}
                    onChange={(event) =>
                      setuser({ ...user, email: event.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel id="demo-simple-select-label">Role</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={user.userType}
                    label="User Type"
                    onChange={(event) =>
                      setuser({
                        ...user,
                        userType: event.target.value as UserType,
                      })
                    }
                  >
                    <MenuItem value={"user"}>User</MenuItem>
                    <MenuItem value={"super-admin"}>Super Admin</MenuItem>
                  </Select>
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
    </div>
  );
}
