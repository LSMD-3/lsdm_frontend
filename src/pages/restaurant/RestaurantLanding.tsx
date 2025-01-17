import { RestaurantApi, TableApi, Neo4jUserApi } from "api";
import { CardItem, DialogManager } from "components";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Restaurant, VirtualTable } from "types";
import {
  Button,
  Container,
  CssBaseline,
  Grid,
  IconButton,
} from "@mui/material";
import store, { likeState } from "redux/store";
import { useSnackbar } from "notistack";
import { Box } from "@mui/system";
import { userState } from "redux/store";
import { useSelector } from "react-redux";
import { Delete, Favorite } from "@mui/icons-material";

export default function RestaurantLanding() {
  let { restaurantId } = useParams();
  const [restaurant, setrestaurant] = useState<Restaurant>();
  const [selectedTable, setselectedTable] = useState<number>(0);
  const [modalOpen, set_modalOpen] = useState(false);
  const likes = useSelector(likeState);
  const [selectedMenu, setselectedMenu] = useState(0);

  const [isLiked, setIsLiked] = useState(
    likes.restaurantLikes.includes(restaurantId ?? "")
  );
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector(userState);

  useEffect(() => {
    fetchRestaurant();
    return () => {};
  }, []);

  const toggleLike = async () => {
    if (!user.user || !restaurant) return;
    setIsLiked(!isLiked);
    if (!isLiked) {
      Neo4jUserApi.likeRestaurant(user.user._id, restaurant._id);
      enqueueSnackbar("Restaurant Liked", { variant: "success" });
    } else {
      Neo4jUserApi.unlikeRestaurant(user.user._id, restaurant._id);
      enqueueSnackbar("Restaurant UnLiked", { variant: "error" });
    }
  };

  const fetchRestaurant = async () => {
    if (!restaurantId) return;
    try {
      const restaurant = await RestaurantApi.find(restaurantId);
      setrestaurant(restaurant);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  let tables: number[] = [];
  if (restaurant) tables = new Array(restaurant.tables_number).fill(1);

  const onTableClick = (table: number) => {
    setselectedTable(table);
    set_modalOpen(true);
  };

  const renderTableList = () => {
    if (!restaurantId) return <h3>Restaurant Not Found</h3>;
    return (
      <Box sx={{ flexGrow: 1 }} style={{ marginTop: 50 }}>
        <h1>
          {restaurant?.nome}{" "}
          <IconButton onClick={toggleLike}>
            <Favorite color={isLiked ? "error" : undefined} />
          </IconButton>
        </h1>
        <h4>Tipologia: {restaurant?.tipologia}</h4>
        <h4>Comune: {restaurant?.comune}</h4>

        {restaurant && (
          <div>
            <h3>Please Select one of the menu above</h3>
            {restaurant.menus.map((menu, idx) => (
              <Button
                variant={idx === selectedMenu ? "contained" : "outlined"}
                onClick={() => setselectedMenu(idx)}
                style={{ marginRight: 20 }}
              >
                {menu.name} {menu.ayce ? "AYCE: €" + menu.price : ""}
              </Button>
            ))}
          </div>
        )}

        <h2 style={{ textAlign: "center" }}>Select a table</h2>
        <Grid
          container
          spacing={{ xs: 6, sm: 6, md: 3 }}
          columnGap={{ md: 6 }}
          columns={{ xs: 8, sm: 8, md: 12 }}
          justifyContent="center"
          style={{ marginTop: 20 }}
        >
          {tables.map((t, i) => {
            return (
              <Grid item xs={6} sm={6} md={3}>
                <CardItem url={"/examples"} onClick={() => onTableClick(i)}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 16,
                    }}
                  >
                    <span
                      className="clickable"
                      style={{ marginRight: 10 }}
                      onClick={() => onTableClick(i)}
                    >
                      {"Join Table " + (i + 1)}
                    </span>
                  </div>
                </CardItem>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  return (
    <Container>
      <CssBaseline />
      {renderTableList()}

      <DialogManager
        type="confirm"
        open={modalOpen}
        confirmText="YES"
        handleClose={() => set_modalOpen(false)}
        dialogProps={{
          title: "Do you want to join table " + (selectedTable + 1),
          onConfirm: () => {
            set_modalOpen(false);
            if (!restaurant) return;
            const joinedTable: VirtualTable = {
              restaurant,
              tableNumber: `${selectedTable + 1}`,
              selectedMenu: selectedMenu,
            };
            console.log("USER:");
            console.log(user.user!._id);
            console.log(restaurant);
            TableApi.joinTable(
              restaurant,
              String(selectedTable + 1),
              user.user!
            );
            store.dispatch({
              type: "table/join",
              payload: joinedTable,
              selectedMenu: selectedMenu,
            });
            navigate("/");
          },
        }}
      />
    </Container>
  );
}
