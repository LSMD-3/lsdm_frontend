import React, { useEffect, useState } from "react";
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
import { likeState, userState } from "redux/store";
import { useSelector } from "react-redux";
import { UserModal } from "./UserModal";
import { UserEmail } from "api/UserApi";
import { RestaurantNameId } from "api/Neo4jApi";

export default function UserProfile() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector(userState);
  const likes = useSelector(likeState);
  const [totalFollowers, setTotalFollowers] = useState<number>();
  const [totalFollows, setTotalFollows] = useState<number>();
  const [followingOpen, setFollowingOpen] = useState(false);
  const [followerOpen, setFollowerOpen] = useState(false);
  const [followsEmails, setFollowsEmails] = useState<UserEmail[]>([]);
  const [followerEmails, setFollowerEmails] = useState<UserEmail[]>([]);
  const [favouriteRestaurants, setFavoriteRestaurants] = useState<
    RestaurantNameId[]
  >([]);

  const fetchFavouritesRestaurants = async () => {
    const favouriteRestaurants = await RestaurantApi.findRestaurantByIds(
      likes.restaurantLikes
    );
    setFavoriteRestaurants(favouriteRestaurants);
  };

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
    fetchFavouritesRestaurants();
    fetchTotalFollows();
    return () => {};
  }, []);

  const renderButton = (children: JSX.Element, onClick?: () => void) => {
    return (
      <Button onClick={onClick} variant="contained" className="m12 flex">
        {children}
      </Button>
    );
  };

  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />

      <div>
        <Grid item xs={7} sm={6} md={4}>
          <h2>Friend List</h2>

          {renderButton(<h4>Followers 👨: {totalFollowers ?? 0}</h4>, () =>
            setFollowerOpen(true)
          )}
          {renderButton(<h4>Following 👨: {totalFollows ?? 0}</h4>, () =>
            setFollowingOpen(true)
          )}

          <br />
          <h2>Your Favourite Restaurants</h2>
          {favouriteRestaurants.map((rest) =>
            renderButton(<h4>{rest.nome}</h4>, () =>
              navigate("/restaurant/" + rest._id)
            )
          )}
          <h2>Your Favourite Recepies</h2>

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
      </div>
      <div></div>
    </Container>
  );
}
