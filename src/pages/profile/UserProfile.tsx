import { useEffect, useState } from "react";
import { Container, Button, CssBaseline } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Restaurant, User } from "types";
import { SearchBar } from "components";
import { RestaurantApi, UserApi, Neo4jApi } from "api";
import { useSnackbar } from "notistack";
import { userState } from "redux/store";
import { useSelector } from "react-redux";

export default function UserProfile() {
  const navigate = useNavigate();
  const [selectedUser, setselectedUser] = useState<User>();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector(userState);

  const fetchFriendsEmail = async () => {
    //const emails = await UserApi.getFollowerEmails(user.user!._id);
  };

  useEffect(() => {
    fetchFriendsEmail();
    return () => {};
  }, []);

  const searchUsers = async (text: string): Promise<User[]> => {
    try {
      const users = await UserApi.search({
        like: { field: "email", value: text, caseSensitive: false },
      });
      return users;
    } catch (error: any) {
      enqueueSnackbar("User not found", { variant: "error" });
    }
    return [];
  };

  const addFriend = async () => {
    if (!selectedUser) return;
    try {
      await Neo4jApi.addFriend(user.user!._id, selectedUser._id);
    } catch (error: any) {
      enqueueSnackbar("Cannot add this user to friends", { variant: "error" });
    }
    return [];
  };

  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
      <h2>Search a someone here</h2>
      <SearchBar<User>
        searchApi={searchUsers}
        onSelectOption={(user: User) => setselectedUser(user)}
        keyExtractor={(u) => u._id}
        labelExtractor={(u) => u.email}
      />

      <Button
        variant="contained"
        disabled={!selectedUser}
        style={{ marginTop: 20 }}
        onClick={addFriend}
      >
        Add Friend
      </Button>
      <div>
        <h4>TODO Friend List</h4>
        <h3>Your Favourite Restaurants</h3>
        <h3>Your Favourite Recepies</h3>
      </div>
    </Container>
  );
}
