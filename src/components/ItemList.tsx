import { Grid } from "@mui/material";
import { Item } from "types";
import CardItem from "./CardItem";

interface ItemListProps {
  items: Item[];
  toggleItemLike: (item: Item) => void;
  increment: (item: Item) => void;
  decrement: (item: Item) => void;
  limit?: number;
}
export default function ItemList({
  items,
  toggleItemLike,
  increment,
  decrement,
  limit,
}: ItemListProps) {
  return (
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
            increment={() =>
              (limit === undefined ||
                (itm.quantity !== undefined && itm.quantity < limit)) &&
              increment(itm)
            }
            decrement={() => decrement(itm)}
            liked={itm.liked}
            quantity={itm.quantity}
            limit={limit}
          />
        </Grid>
      ))}
    </Grid>
  );
}
