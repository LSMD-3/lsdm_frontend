import { RestaurantApi } from "api";
import { CardItem, Table } from "components";
import { TableColumn } from "components/Table";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Restaurant } from "types";
import { Grid, Typography } from "@mui/material";
import { ModeEdit, MenuBook } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { userState } from "redux/store";
import { useSnackbar } from "notistack";
import { Box } from "@mui/system";

import { SpringModal, FlexBox, Footer } from "components";

export default function RestaurantLanding() {
  let { restaurantId } = useParams();
  const [restaurant, setrestaurant] = useState<Restaurant>();
  const [selectedTable, setselectedTable] = useState<number>();
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
      setrestaurant(restaurant);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  let tables: number[] = [];
  if (restaurant) tables = new Array(restaurant.tables_number).fill(1);

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
                <CardItem
                  url={"/examples"}
                  onClick={() =>
                    navigate(`/restaurant/${restaurantId}/table_${i + 1}`)
                  }
                >
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
                      onClick={() =>
                        navigate(`/restaurant/${restaurantId}/table_${i + 1}`)
                      }
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

  return <div>{renderTableList()} </div>;
}
