import { Container, CssBaseline, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import { userState } from "redux/store";
import UserProfile from "./UserProfile";

export default function Profile() {
  const user = useSelector(userState);

  const renderAdminProfile = () => {
    return (
      <div>
        <h4>TODO Admin profile</h4>
      </div>
    );
  };

  const renderSuperAdminProfile = () => {
    return (
      <div>
        <h4>TODO Super Admin profile</h4>
      </div>
    );
  };

  const renderWaiterProfile = () => {
    return (
      <div>
        <h4>TODO Waiter profile</h4>
      </div>
    );
  };

  const renderChefProfile = () => {
    return (
      <div>
        <h4>TODO Chef profile</h4>
      </div>
    );
  };

  const userType = user.user?.userType;

  if (userType === "user") return <UserProfile />;

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

        {userType === "waiter" && renderWaiterProfile()}
        {userType === "chef" && renderChefProfile()}
        {userType === "admin" && renderAdminProfile()}
        {userType === "super-admin" && renderSuperAdminProfile()}
      </Box>
    </Container>
  );
}
