import { Container, CssBaseline } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { cartState, userState } from "redux/store";
import { MenuRecipe } from "types";

export default function UserCart() {
  const user = useSelector(userState);
  const cart = useSelector(cartState);

  if (!user.user?.joinedTable)
    return (
      <Container>
        <CssBaseline />
        <h2>Join a restaurant to see cart</h2>
      </Container>
    );

  const isCartEmpty = !cart || Object.keys(cart).length === 0;
  const allRecipes = user.user.joinedTable.restaurant.menu.recipes;
  let cartRecipes: MenuRecipe[] = [];
  if (!isCartEmpty) {
    cartRecipes = allRecipes.filter((r) => cart[r._id]);
  }
  console.log(cartRecipes);

  return (
    <Container>
      <CssBaseline />
      <h2>User cart</h2>
      {isCartEmpty && <h3>Cart is empty</h3>}
      {/* {!isCartEmpty && <ItemList items={cart.cart} />} */}
    </Container>
  );
}
