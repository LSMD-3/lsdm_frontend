import { useState, useEffect } from "react";
import { Container, Button, CssBaseline } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Item, Menu, Order, Restaurant, TableOrder } from "types";
import { ItemList, SearchBar } from "components";
import { RestaurantApi, TableApi } from "api";
import { useSelector } from "react-redux";
import store, { userState } from "redux/store";
import { useSnackbar } from "notistack";
import { extractItemsFromMenu } from "helpers";

export default function ChefHome() {
  const navigate = useNavigate();
  const [selectedRestaurant, setselectedRestaurant] = useState<Restaurant>();
  const user = useSelector(userState);
  const { enqueueSnackbar } = useSnackbar();
  const [menu, setMenu] = useState<Menu>();
  const [orders, setorders] = useState<TableOrder[]>();

  const fetchOrders = async (restaurantId: string) => {
    const menu = await RestaurantApi.getMenu(restaurantId);
    setMenu(menu);
    let tableOrders = await TableApi.get_orders_for_chef(restaurantId);
    setorders(tableOrders);
  };

  useEffect(() => {
    if (user.user?.joinedRestaurant)
      fetchOrders(user.user?.joinedRestaurant._id);
    return () => {};
  }, []);

  const joinRestaurant = async () => {
    if (!selectedRestaurant || !user.user) return;
    try {
      await RestaurantApi.addStaffMember(
        selectedRestaurant._id,
        user.user._id,
        "chef"
      );
      store.dispatch({ type: "restaurant/join", payload: selectedRestaurant });
      fetchOrders(selectedRestaurant._id);
      enqueueSnackbar("Ristorante associato", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  const renderSearchRestaurant = () => {
    return (
      <div>
        <SearchBar<Restaurant>
          searchApi={(text) => RestaurantApi.searchRestaurantByName(text)}
          onSelectOption={(restaurant: Restaurant) =>
            setselectedRestaurant(restaurant)
          }
          keyExtractor={(rest) => rest._id}
          labelExtractor={(rest) => rest.nome}
        />

        <Button
          variant="contained"
          disabled={!selectedRestaurant}
          style={{ marginTop: 20 }}
          onClick={joinRestaurant}
        >
          Join Restaurant
        </Button>
      </div>
    );
  };

  const onRecipeClick = async (item: Item, order: Order, tableId: string) => {
    let order_index = 0;
    console.log(order);
    console.log("HERE");
    console.log(item.index);
    order.forEach((o, index) => {
      if (o._id === item._id && o.status === "In preparation") {
        o.status = "To be delivered";
      }
    });
    const restaurantId = user.user!.joinedRestaurant!._id;
    console.log(order_index);
    console.log(order);
    try {
      await TableApi.updateOrder(
        restaurantId,
        tableId,
        String(item.index),
        order
      );
      fetchOrders(restaurantId);
    } catch (e) {
      enqueueSnackbar("Order update fails", { variant: "error" });
    }
  };

  const renderOrder = (order: Order, tableId: string, index: number) => {
    if (!menu) return <></>;
    const recipeIds = order.map((o) => o._id);
    const items: Item[] = extractItemsFromMenu(menu)
      .filter((itm) => recipeIds.includes(itm._id))
      .map((itm) => {
        const recipeOrdered = order.find((o) => o._id === itm._id);
        if (recipeOrdered) {
          itm.quantity = recipeOrdered.qty;
          itm.note = recipeOrdered.note;
          itm.status = recipeOrdered.status;
          itm.invisible = recipeOrdered.status !== "In preparation";
          itm.index = index;
        }
        return itm;
      });

    return (
      <div key={"table_" + tableId}>
        <h3>Table {tableId}</h3>
        <ItemList
          items={items}
          onClick={(item) => onRecipeClick(item, order, tableId)}
        />
      </div>
    );
  };

  const renderTableOrders = (o: TableOrder) => {
    const orders = o.orders;
    return (
      <div key={o.tableId}>
        {orders &&
          orders.map((order, i) => {
            return renderOrder(order, o.tableId, i);
          })}
      </div>
    );
  };

  const joinedRestaurant = user.user?.joinedRestaurant;
  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
      {!joinedRestaurant && (
        <div>
          <h2>Search a restaurant here</h2>
          {renderSearchRestaurant()}
        </div>
      )}
      {joinedRestaurant && <h2>My restaurant is {joinedRestaurant.nome}</h2>}
      {orders && <div>{orders.map((o) => renderTableOrders(o))}</div>}
    </Container>
  );
}
