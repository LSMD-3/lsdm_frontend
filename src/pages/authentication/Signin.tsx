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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Copyright } from "components";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthenticationApi from "api/AuthenticationApi";
import { useSnackbar } from "notistack";
import store from "redux/store";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function Signin() {
  const { enqueueSnackbar } = useSnackbar();

  const [hidePassword, sethidePassword] = React.useState(true);
  const [emailError, setemailError] = React.useState<string>("");
  const [passwordError, setpasswordError] = React.useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();

    if (!email) return setemailError("Please provide valid email");
    setemailError("");
    if (!password) return setpasswordError("Please provide valid password");
    setpasswordError("");

    try {
      const user = await AuthenticationApi.login(email, password);
      store.dispatch({
        type: "user/login",
        payload: user,
      });
      enqueueSnackbar("Login effettuato", { variant: "success" });
      navigate("/");
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };
  return (
    <ThemeProvider theme={theme}>
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
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
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
                  autoComplete="password"
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
              Sign In
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="signup" variant="body2">
                  Don't have an account? Sign up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
