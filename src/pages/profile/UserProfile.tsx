import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  CssBaseline,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Item, Recipe, Restaurant, RestaurantNameId, User } from "types";
import { ItemList, SearchBar, DialogManager } from "components";
import { RestaurantApi, UserApi, Neo4jUserApi, RecipeApi } from "api";
import { useSnackbar } from "notistack";
import store, { likeState, userState } from "redux/store";
import { useSelector } from "react-redux";
import { UserModal } from "./UserModal";

export default function UserProfile() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector(userState);
  const likes = useSelector(likeState);
  const [totalFollowers, setTotalFollowers] = useState<number>();
  const [totalFollows, setTotalFollows] = useState<number>();
  const [followingOpen, setFollowingOpen] = useState(false);
  const [followerOpen, setFollowerOpen] = useState(false);
  const [follows, setfollows] = useState<User[]>([]);
  const [followers, setfollowers] = useState<User[]>([]);
  const [favouriteRestaurants, setFavoriteRestaurants] = useState<
    RestaurantNameId[]
  >([]);
  const [favouriteRecipes, setFavouriteRecipes] = useState<Item[]>([]);

  const fetchFavouritesRestaurants = async () => {
    const favouriteRestaurants = await RestaurantApi.findRestaurantByIds(
      likes.restaurantLikes
    );
    setFavoriteRestaurants(favouriteRestaurants);
  };

  const fetchFavouritesRecipes = async () => {
    const favouriteRecipes = await RecipeApi.getRecipesByIds(
      likes.recipesLikes
    );
    const items = favouriteRecipes.map((r) => {
      const item: Item = {
        _id: r._id,
        recipe_name: r.recipe_name,
        image_url: r.image_url,
        ingredients: r.ingredients,
        liked: true,
      };
      return item;
    });
    setFavouriteRecipes(items);
  };

  const fetchTotalFollowers = async () => {
    const followers = await Neo4jUserApi.getFollowers(user.user!._id);
    setTotalFollowers(followers.length);
    setfollowers(followers);
  };

  const fetchTotalFollows = async () => {
    const follows = await Neo4jUserApi.getFollows(user.user!._id);
    setTotalFollows(follows.length);
    setfollows(follows);
  };

  const onModalAction = (userId: string) => {
    if (followingOpen) return unfollowFriend(userId);
  };

  const unfollowFriend = async (userId: string) => {
    try {
      await Neo4jUserApi.unfollowUser(user.user!._id, userId);
      fetchTotalFollows();
    } catch (error: any) {
      enqueueSnackbar("You cannot unfollow friend", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchTotalFollowers();
    fetchFavouritesRestaurants();
    fetchFavouritesRecipes();
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

  const toggleItemLike = (item: Item, liked: boolean) => {
    store.dispatch({ type: "recipe/toggleLike", payload: item._id });
    if (liked) {
      Neo4jUserApi.likeRecipe(user.user!._id, item._id);
    } else {
      Neo4jUserApi.unlikeRecipe(user.user!._id, item._id);
    }
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
          {renderButton(<h4>Get Suggested friends</h4>, () =>
            Neo4jUserApi.suggestfriends(user.user!._id)
          )}
          {renderButton(<h4>Get Suggested restaurants</h4>, () =>
            Neo4jUserApi.suggestrestaurants(user.user!._id)
          )}
          {renderButton(<h4>Get Suggested recipes</h4>, () =>
            Neo4jUserApi.suggestrecipes(user.user!._id)
          )}

          <br />
          <h2>Your Favourite Restaurants</h2>
          {favouriteRestaurants.map((rest) =>
            renderButton(<h4>{rest.nome}</h4>, () =>
              navigate("/restaurant/" + rest._id)
            )
          )}

          <UserModal
            open={followingOpen || followerOpen}
            onClose={() => {
              setFollowingOpen(false);
              setFollowerOpen(false);
            }}
            users={followingOpen ? follows : followers}
            onClick={onModalAction}
            onUserAdded={followingOpen ? fetchTotalFollows : undefined}
            title={followingOpen ? "Following Users" : "Your Followers"}
          />
        </Grid>
        <h2>Your Favourite Recepies</h2>
        <ItemList
          items={favouriteRecipes}
          likedItems={likes.recipesLikes}
          toggleItemLike={toggleItemLike}
        />
      </div>
      <div></div>
    </Container>
  );
}
