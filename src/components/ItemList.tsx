import { Grid } from "@mui/material";
import { Item } from "types";
import CardItem from "./CardItem";

interface ItemListProps {
  items: Item[];
  toggleItemLike?: (item: Item, liked: boolean) => void;
  increment?: (item: Item) => void;
  decrement?: (item: Item) => void;
  limit?: number;
  likedItems?: string[];
  onClick?: (item: Item) => void;
}
export default function ItemList({
  items,
  toggleItemLike,
  increment,
  decrement,
  limit,
  likedItems,
  onClick,
}: ItemListProps) {
  const inc = (itm: Item) => {
    if (!increment) return;
    if (
      limit === undefined ||
      (itm.quantity !== undefined && itm.quantity < limit)
    )
      increment(itm);
  };
  const dec = (itm: Item) => decrement && decrement(itm);

  const toggle = (itm: Item) =>
    toggleItemLike &&
    likedItems &&
    toggleItemLike(itm, !likedItems.includes(itm._id));

  return (
    <Grid
      container
      spacing={{ xs: 6, sm: 6, md: 3 }}
      columnGap={{ md: 6 }}
      columns={{ xs: 8, sm: 8, md: 12 }}
      justifyContent="center"
      style={{ marginTop: 40 }}
    >
      {items
        .filter((itm) => !itm.invisible)
        .map((itm) => (
          <Grid key={itm._id} item xs={6} sm={6} md={3}>
            <CardItem
              text={itm.name}
              image={itm.image_url}
              toggleLike={toggleItemLike ? () => toggle(itm) : undefined}
              increment={increment ? () => inc(itm) : undefined}
              decrement={decrement ? () => dec(itm) : undefined}
              liked={likedItems ? likedItems.includes(itm._id) : undefined}
              quantity={itm.quantity}
              limit={limit}
              status={itm.status}
              onClick={onClick ? () => onClick(itm) : undefined}
            />
          </Grid>
        ))}
    </Grid>
  );
}
