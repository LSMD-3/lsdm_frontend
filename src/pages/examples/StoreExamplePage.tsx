import { CircularProgress, Grid } from "@mui/material";
import { CardItem } from "components";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";

import store, { cartState, likeState } from "redux/store";
import { Item } from "stores";
import { sleep } from "utils/helper";
import ITEMS from "../../generators/items1.json";
import ITEMS2 from "../../generators/items2.json";
import ITEMS3 from "../../generators/items3.json";

export default function StoreExamplePage() {
  const cart = useSelector(cartState);
  const likes = useSelector(likeState);
  const [items, setitems] = useState<Item[]>([]);
  const [loading, setloading] = useState(true);
  const [page, setpage] = useState(0);
  const [endReached, setendReached] = useState(false);

  useEffect(() => {
    if (page === 0) return;
    if (page === 1) setitems([...ITEMS, ...ITEMS2]);
    if (page === 2) setitems([...ITEMS, ...ITEMS2, ...ITEMS3]);
    return () => {};
  }, [page]);

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

  useEffect(() => {
    fetchItems();
    return () => {
      // cleanup;
    };
  }, []);

  const fetchItems = async () => {
    await sleep(1000);
    setitems(ITEMS);
    setloading(false);
  };

  const fetchNextItems = async () => {
    await sleep(500);
    if (page === 2) {
      console.log("end reached");
      return setendReached(true);
    }
    setpage(page + 1);
  };

  if (loading)
    return (
      <div className="center-loader">
        <CircularProgress />
      </div>
    );

  const refresh = () => {
    setpage(0);
    fetchItems();
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={items.length} //This is important field to render the next data
        next={fetchNextItems}
        hasMore={!endReached}
        loader={
          <div className="center-loader">
            <CircularProgress />
          </div>
        }
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
              }}
            >
              Back To Top
            </button>
          </p>
        }
        // below props only if you need pull down functionality
        refreshFunction={refresh}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
        }
      >
        <Grid
          container
          spacing={{ xs: 6, sm: 6, md: 3 }}
          columnGap={{ md: 6 }}
          columns={{ xs: 8, sm: 8, md: 12 }}
          justifyContent="center"
          style={{ marginTop: 40 }}
        >
          {items.map((itm) => (
            <Grid key={itm.id} item xs={6} sm={6} md={3}>
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
      </InfiniteScroll>
    </div>
  );
}
