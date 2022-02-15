import { useState, useEffect } from "react";
import { Container, CssBaseline } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Item, RecipeOrder, Restaurant, TableOrder } from "types";
import { ItemList } from "components";
import { TableApi } from "api";
import { useSelector } from "react-redux";
import { userState } from "redux/store";
import { useSnackbar } from "notistack";

export default function WaiterHome() {
  const navigate = useNavigate();
  const user = useSelector(userState);
  const { enqueueSnackbar } = useSnackbar();
  const [orders, setorders] = useState<TableOrder[]>();

  const fetchOrders = async (restaurant: Restaurant) => {
    let tableOrders = await TableApi.get_orders_for_chef(restaurant);
    setorders(tableOrders);
  };

  useEffect(() => {
    if (user.user?.joinedRestaurant) fetchOrders(user.user?.joinedRestaurant);
    return () => {};
  }, []);

  const onRecipeClick = async (
    item: Item,
    order: RecipeOrder[],
    tableId: string,
    orderIndex: number
  ) => {
    order.forEach((o, index) => {
      if (o._id === item._id && o.status === "To be delivered") {
        o.status = "Delivered";
      }
    });
    const restaurant = user.user!.joinedRestaurant!;
    try {
      await TableApi.updateOrder(
        restaurant,
        tableId,
        String(orderIndex),
        order
      );
      fetchOrders(restaurant);
    } catch (e) {
      enqueueSnackbar("Order update fails", { variant: "error" });
    }
  };

  const renderOrder = (
    order: RecipeOrder[],
    tableId: string,
    orderIndex: number
  ) => {
    const items: Item[] = [];
    let hasItemInPreparation = false;

    order.forEach((o) => {
      const recipe: Item = { ...o };
      recipe.invisible = o.status !== "To be delivered";
      recipe.quantity = o.qty;
      if (o.status === "To be delivered") hasItemInPreparation = true;

      items.push(recipe);
    });

    if (!hasItemInPreparation) return <></>;

    return (
      <div key={"table_" + tableId}>
        <h3>Table {tableId}</h3>
        <ItemList
          items={items}
          onClick={(item) => onRecipeClick(item, order, tableId, orderIndex)}
        />
      </div>
    );
  };

  const renderTableOrders = (o: TableOrder, orderIndex: number) => {
    const orders = o.orders;
    return (
      <div key={o.tableId}>
        {orders && renderOrder(orders, o.tableId, orderIndex)}
      </div>
    );
  };

  const joinedRestaurant = user.user?.joinedRestaurant;
  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
      {joinedRestaurant && <h2>My restaurant is {joinedRestaurant.nome}</h2>}
      {!orders && <div>There are not orders to process</div>}
      {orders && <div>{orders.map((o, idx) => renderTableOrders(o, idx))}</div>}
    </Container>
  );
}
