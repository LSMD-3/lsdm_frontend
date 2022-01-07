import { Container, CssBaseline, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Footer } from "components";
import { useSelector } from "react-redux";
import { userState } from "redux/store";

export default function Profile() {
  const handleSubmit = () => {};
  const user = useSelector(userState);

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
        <Typography component="h1" variant="h5">
          {user.authenticated ? user.user?.email : "Non sei autenticato"}
        </Typography>

        <h4>TODO Friend List</h4>
        <h4>TODO Search for a new friend</h4>

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        ></Box>
      </Box>
    </Container>
  );
}
