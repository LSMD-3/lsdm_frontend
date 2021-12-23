import { Grid } from "@mui/material";
import { CardItem } from "components";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import store from "redux/store";
import { Cart, Item } from "stores";
import sleep from "utils/helper";
import ITEMS from "../../generators/items.json";

export default function StoreExamplePage() {
  const cartState = (state: any) => {
    return state.cartState.cart as Cart;
  };
  const likeState = (state: any) => {
    return state.likesState.itemLikes as string[];
  };

  const cart = useSelector(cartState);
  const likes = useSelector(likeState);
  const [items, setitems] = useState<Item[]>([]);

  const toggleItemLike = (item: Item) => {
    store.dispatch({
      type: "item/toggleLike",
      payload: item.id,
    });
  };

  const addToCart = (item: Item) => {
    store.dispatch({
      type: "cart/addItem",
      payload: item,
    });
  };

  const decrementCart = (item: Item) => {
    store.dispatch({
      type: "cart/decreaseItemQuantity",
      payload: item,
    });
  };
  // const addItem = (item: Item) => {
  //   store.dispatch({
  //     type: "cart/addItem",
  //     payload: item,
  //   });
  // };

  useEffect(() => {
    fetchItems();
    return () => {
      // cleanup;
    };
  }, []);

  const fetchItems = async () => {
    await sleep(300);
    setitems(ITEMS);
  };

  return (
    <div>
      <Grid
        container
        spacing={{ xs: 6, sm: 6, md: 3 }}
        columnGap={{ md: 6 }}
        columns={{ xs: 8, sm: 8, md: 12 }}
        justifyContent="center"
        style={{ marginTop: 40 }}
      >
        {items.map((itm) => (
          <Grid item xs={6} sm={6} md={3}>
            <CardItem
              text={itm.name}
              image={itm.image_url}
              toggleLike={() => toggleItemLike(itm)}
              increment={() => (cart[itm.id] ?? 0) < 5 && addToCart(itm)}
              decrement={() => decrementCart(itm)}
              liked={(likes || []).includes(itm.id)}
              quantity={cart[itm.id]}
              limit={5}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
