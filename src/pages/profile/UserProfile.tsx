import { useEffect, useState } from "react";
import {
  Container,
  Button,
  CssBaseline,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Restaurant, User } from "types";
import { ItemList, SearchBar, DialogManager } from "components";
import { RestaurantApi, UserApi, Neo4jApi } from "api";
import { useSnackbar } from "notistack";
import { userState } from "redux/store";
import { useSelector } from "react-redux";
import { UserModal } from "./UserModal";

export default function UserProfile() {
  const navigate = useNavigate();
  const [modalOpen, set_modalOpen] = useState(false);
  const [selectedUser, setselectedUser] = useState<User>();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector(userState);
  const [totalFollowers, setTotalFollowers] = useState<number>();
  const [totalFollows, setTotalFollows] = useState<number>();
  const [followingOpen, setFollowingOpen] = useState(false);
  const [followsEmails, setFollowsEmails] = useState<
    { _id: string; email: string }[]
  >([]);

  const fetchFriendsEmail = async () => {
    const emails = await UserApi.getFollowerEmails(user.user!._id);
    const followsEmails = await UserApi.getFollowsEmail(user.user!._id);
    setFollowsEmails(followsEmails);
  };

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
      fetchTotalFollowers();
      fetchTotalFollows();
    } catch (error: any) {
      enqueueSnackbar("Cannot add this user to friends", { variant: "error" });
    }

    return [];
  };

  const fetchTotalFollowers = async () => {
    try {
      const result = await Neo4jApi.getFollowersCount(user.user!._id);
      // console.log(result.length);
      setTotalFollowers(result.length);
    } catch (error: any) {
      enqueueSnackbar("No one Follows you", { variant: "info" });
    }
    return 0;
  };

  const fetchTotalFollows = async () => {
    try {
      const result = await Neo4jApi.getFollowsCount(user.user!._id);
      setTotalFollows(result[0]);
    } catch (error: any) {
      enqueueSnackbar("You do not follow anyone", { variant: "info" });
    }
    return 0;
  };

  const unfollowFriend = async (userId: string) => {
    try {
      const result = await Neo4jApi.unfollowFriend(user.user!._id, userId);
      fetchTotalFollows();
      fetchFriendsEmail();
    } catch (error: any) {
      enqueueSnackbar("You cannot unfollow friend", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchFriendsEmail();
    fetchTotalFollowers();
    fetchTotalFollows();
    return () => {};
  }, []);

  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
      <h2>Search for Friends here:</h2>
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
        <Grid item xs={7} sm={6} md={4}>
          <Button
            variant="contained"
            className="m12 flex"
            onClick={() => set_modalOpen(true)}
          >
            {totalFollowers && <h4>Followers 👨: {totalFollowers}</h4>}
          </Button>
          <DialogManager
            type="confirm"
            open={modalOpen}
            handleClose={() => set_modalOpen(false)}
            dialogProps={{
              title: `Total Followers for ${user.user?.name}`,
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
              onConfirm: () => {
                set_modalOpen(false);
                console.log("CONFERMATO");
              },
            }}
          />

          <Button
            variant="contained"
            className="m12 flex"
            onClick={() => set_modalOpen(true)}
          >
            {totalFollows && <h4>Following 👨: {totalFollows}</h4>}
          </Button>

          <br />
          <Button variant="outlined" onClick={() => setFollowingOpen(true)}>
            Open simple dialog
          </Button>
          <UserModal
            open={followingOpen}
            onClose={() => setFollowingOpen(false)}
            emails={followsEmails}
            onClick={unfollowFriend}
          />

          <DialogManager
            type="confirm"
            open={modalOpen}
            handleClose={() => set_modalOpen(false)}
            dialogProps={{
              title: `Total Friends ${user.user?.name} is Following`,
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
              onConfirm: () => {
                set_modalOpen(false);
                console.log("CONFERMATO");
              },
            }}
          />
        </Grid>

        <h3>Your Favourite Restaurants</h3>
        <h3>Your Favourite Recepies</h3>
      </div>
      <div></div>
    </Container>
  );
}
