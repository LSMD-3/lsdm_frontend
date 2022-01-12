import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Copyright } from "components";
import AuthenticationApi from "api/AuthenticationApi";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import store from "redux/store";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();
    const name = data.get("firstName")?.toString();
    const surname = data.get("lastName")?.toString();
    if (!name) return setnameError("Please provide your first name");
    setnameError("");
    if (!surname) return setsurnameError("Please provide your last name");
    setsurnameError("");
    if (!email) return setemailError("Please provide valid email");
    setemailError("");
    if (!password) return setpasswordError("Please provide valid password");
    setpasswordError("");

    try {
      const user = await AuthenticationApi.signup(
        email,
        password,
        name,
        surname
      );
      store.dispatch({
        type: "user/login",
        payload: user,
      });
      navigate("/");
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  const [hidePassword, sethidePassword] = React.useState(true);
  const [emailError, setemailError] = React.useState<string>("");
  const [passwordError, setpasswordError] = React.useState<string>("");
  const [nameError, setnameError] = React.useState<string>("");
  const [surnameError, setsurnameError] = React.useState<string>("");

  return (
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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                helperText={nameError}
                error={nameError.length > 0}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                helperText={surnameError}
                error={surnameError.length > 0}
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
                helperText={emailError}
                error={emailError.length > 0}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={hidePassword ? "password" : "text"}
                id="password"
                autoComplete="new-password"
                helperText={passwordError}
                error={passwordError.length > 0}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => sethidePassword(!hidePassword)}
                        edge="end"
                      >
                        {hidePassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
