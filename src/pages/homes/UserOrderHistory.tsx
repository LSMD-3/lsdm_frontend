import { Container } from "@mui/material";
import { TableApi } from "api";
import { RecipeHistory } from "api/TableApi";
import { ItemList } from "components";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { likeState, userState } from "redux/store";

export default function UserOrderHistory() {
  const [history, sethistory] = useState<RecipeHistory[]>([]);
  const user = useSelector(userState);
  const likes = useSelector(likeState);

  const fetchOrderHistory = async () => {
    const result = await TableApi.getRecipesPokedex(user.user!._id);
    sethistory(result);
  };

  const renderHistory = (history: RecipeHistory) => {
    return (
      <Container>
        <h2>{history.restaurant.nome}</h2>
        <ItemList items={history.recipes} likedItems={likes.recipesLikes} />
      </Container>
    );
  };
  useEffect(() => {
    fetchOrderHistory();
    return () => {};
  }, []);

  return <div>{history.map((h) => renderHistory(h))}</div>;
}
