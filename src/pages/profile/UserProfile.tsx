import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  CssBaseline,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Item, Recipe, Restaurant, RestaurantNameId, User } from "types";
import { ItemList, SearchBar, DialogManager } from "components";
import { RestaurantApi, UserApi, Neo4jUserApi, RecipeApi, TableApi } from "api";
import { useSnackbar } from "notistack";
import store, { likeState, userState } from "redux/store";
import { AnyIfEmpty, useSelector } from "react-redux";
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
  const [suggestedFriends, setsuggestedFriends] = useState<User[]>([]);
  const [suggestedRecipes, setsuggestedRecipes] = useState<Recipe[]>([]);
  const [suggestedRestaurants, setsuggestedRestaurants] = useState<
    Restaurant[]
  >([]);
  const [favouriteRestaurants, setFavoriteRestaurants] = useState<
    RestaurantNameId[]
  >([]);
  const [favouriteRecipes, setFavouriteRecipes] = useState<Item[]>([]);
  const [result, setresult] = useState<any[]>([]);
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

  const fetchSuggestedFriends = async () => {
    const suggestedFriends = await Neo4jUserApi.suggestfriends(user.user!._id);
    setsuggestedFriends(suggestedFriends.map((f: any) => f));
  };

  const fetchSuggestedRecipes = async () => {
    const suggestedRecipes = await Neo4jUserApi.suggestrecipes(user.user!._id);
    setsuggestedRecipes(
      suggestedRecipes.map((f: any) => {
        return {
          category: f.category,
          _id: f.id,
          recipe_name: f.name,
          image_url: f.image,
          ingredients: f.ingredients.split(","),
        };
      })
    );
  };

  const fetchSuggestedRestaurants = async () => {
    const suggestedRestaurants = await Neo4jUserApi.suggestrestaurants(
      user.user!._id
    );
    setsuggestedRestaurants(
      suggestedRestaurants.map((f: any) => {
        return { _id: f.id, nome: f.name };
      })
    );
  };
  const getMostOrderedRecipeForUser = async (userId: string) => {
    console.log("IN");
    const result = await TableApi.getMostOrderedRecipeForUser(userId);
    setresult(result);
  };

  useEffect(() => {
    fetchTotalFollowers();
    fetchFavouritesRestaurants();
    fetchFavouritesRecipes();
    fetchTotalFollows();
    fetchSuggestedFriends();
    fetchSuggestedRestaurants();
    fetchSuggestedRecipes();
    getMostOrderedRecipeForUser(user.user!._id);
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

  const followsId = follows.map((f) => f._id);

  const BasicTable = ({
    columns,
    rows,
  }: {
    columns: string[];
    rows: any[];
  }) => {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell>{c}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {columns.map((c) => (
                  <TableCell component="th" scope="row">
                    {row[c]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />

      <div>
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

        <h2>Your Favourite Recepis</h2>
        <ItemList
          items={favouriteRecipes}
          likedItems={likes.recipesLikes}
          toggleItemLike={toggleItemLike}
        />
        <h2>Your Top 10 Ordered Recepis</h2>
        <BasicTable columns={["_id", "recipe_name", "count"]} rows={result} />
        {follows.length > 0 && (
          <div>
            <h2>People you could eat with</h2>
            {suggestedFriends.slice(0, 6).map((user) => (
              <span>
                [{user.email}] {user.name} {user.surname}
                <br />
              </span>
            ))}
          </div>
        )}
        {likes.restaurantLikes.length > 0 && (
          <div>
            <h2>Restaurants you may like</h2>
            {suggestedRestaurants
              .filter((r) => !likes.restaurantLikes.includes(r._id))
              .slice(0, 6)
              .map((rest) =>
                renderButton(<h4>{rest.nome}</h4>, () =>
                  navigate("/restaurant/" + rest._id)
                )
              )}
          </div>
        )}
        {likes.recipesLikes.length > 0 && (
          <div>
            <h2>Recipes you may like</h2>
            <ItemList
              items={suggestedRecipes
                .filter((r) => !likes.recipesLikes.includes(r._id))
                .slice(0, 6)}
              likedItems={likes.recipesLikes}
              toggleItemLike={toggleItemLike}
            />
          </div>
        )}
      </div>
      <div></div>
    </Container>
  );
}
