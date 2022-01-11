import { Container, CssBaseline, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Footer } from "components";
import { useSelector } from "react-redux";
import { userState } from "redux/store";

export default function Profile() {
  const handleSubmit = () => {};
  const user = useSelector(userState);

  const renderUserProfile = () => {
    return (
      <div>
        <h4>TODO Friend List</h4>
        <h4>TODO Search for a new friend</h4>
      </div>
    );
  };

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

        {userType === "user" && renderUserProfile()}
        {userType === "waiter" && renderWaiterProfile()}
        {userType === "chef" && renderChefProfile()}
        {userType === "admin" && renderAdminProfile()}
        {userType === "super-admin" && renderSuperAdminProfile()}
      </Box>
    </Container>
  );
}
