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
import { UserEmail } from "api/UserApi";

export default function UserProfile() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector(userState);
  const [totalFollowers, setTotalFollowers] = useState<number>();
  const [totalFollows, setTotalFollows] = useState<number>();
  const [followingOpen, setFollowingOpen] = useState(false);
  const [followerOpen, setFollowerOpen] = useState(false);
  const [followsEmails, setFollowsEmails] = useState<UserEmail[]>([]);
  const [followerEmails, setFollowerEmails] = useState<UserEmail[]>([]);

  const fetchTotalFollowers = async () => {
    const result = await Neo4jApi.getFollowersCount(user.user!._id);
    setTotalFollowers(result.length);
    const followerEmails = await UserApi.getFollowerEmails(user.user!._id);
    setFollowerEmails(followerEmails);
  };

  const fetchTotalFollows = async () => {
    const result = await Neo4jApi.getFollowsCount(user.user!._id);
    setTotalFollows(result[0]);
    const followsEmails = await UserApi.getFollowsEmail(user.user!._id);
    setFollowsEmails(followsEmails);
  };

  const onModalAction = (userId: string) => {
    if (followingOpen) return unfollowFriend(userId);
  };

  const unfollowFriend = async (userId: string) => {
    try {
      await Neo4jApi.unfollowFriend(user.user!._id, userId);
      fetchTotalFollows();
    } catch (error: any) {
      enqueueSnackbar("You cannot unfollow friend", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchTotalFollowers();
    fetchTotalFollows();
    return () => {};
  }, []);

  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
      <h2>Search for Friends here:</h2>

      <div>
        <Grid item xs={7} sm={6} md={4}>
          <Button
            onClick={() => setFollowerOpen(true)}
            variant="contained"
            className="m12 flex"
          >
            {totalFollowers && <h4>Followers 👨: {totalFollowers}</h4>}
          </Button>

          <Button
            variant="contained"
            className="m12 flex"
            onClick={() => setFollowingOpen(true)}
          >
            {totalFollows && <h4>Following 👨: {totalFollows}</h4>}
          </Button>

          <br />

          <UserModal
            open={followingOpen || followerOpen}
            onClose={() => {
              setFollowingOpen(false);
              setFollowerOpen(false);
            }}
            emails={followingOpen ? followsEmails : followerEmails}
            onClick={onModalAction}
            onUserAdded={followingOpen ? fetchTotalFollows : undefined}
            title={followingOpen ? "Following Users" : "Your Followers"}
          />
        </Grid>

        <h3>Your Favourite Restaurants</h3>
        <h3>Your Favourite Recepies</h3>
      </div>
      <div></div>
    </Container>
  );
}
