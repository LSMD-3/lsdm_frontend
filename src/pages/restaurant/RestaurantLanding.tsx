import { RestaurantApi } from "api";
import { CardItem, DialogManager } from "components";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Restaurant, VirtualTable } from "types";
import { Container, CssBaseline, Grid } from "@mui/material";
import store from "redux/store";
import { useSnackbar } from "notistack";
import { Box } from "@mui/system";

export default function RestaurantLanding() {
  let { restaurantId } = useParams();
  const [restaurant, setrestaurant] = useState<Restaurant>();
  const [selectedTable, setselectedTable] = useState<number>(0);
  const [modalOpen, set_modalOpen] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchRestaurant();
    return () => {};
  }, []);

  const fetchRestaurant = async () => {
    if (!restaurantId) return;
    try {
      const restaurant = await RestaurantApi.find(restaurantId);
      const menu = await RestaurantApi.getMenu(restaurantId);
      restaurant.menu = menu;
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
              tableNumber: `table_${selectedTable + 1}`,
            };
            store.dispatch({
              type: "table/join",
              payload: joinedTable,
            });
            navigate("/");
          },
        }}
      />
    </Container>
  );
}
