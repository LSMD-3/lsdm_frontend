import { TableApi } from "api";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function SuperAdminHome() {
  const [result1, setresult1] = useState<any[]>([]);
  const [result2, setresult2] = useState<any[]>([]);
  const [result3, setresult3] = useState<any[]>([]);
  const [result4, setresult4] = useState<any[]>([]);

  const getTopRecipesOfTopVisitedRestaurants = async () => {
    const result = await TableApi.getTopRecipesOfTopVisitedRestaurants();
    setresult1(result);
  };
  const getMostVisitedRestaurant = async () => {
    const result = await TableApi.getMostVisitedRestaurant();
    setresult2(result);
  };
  const getRestaurantWithMoreDistinctOrders = async () => {
    const result = await TableApi.getRestaurantWithMoreDistinctOrders();
    setresult3(result);
  };
  const countUniqueRecipes = async () => {
    const result = await TableApi.countUniqueRecipes();
    setresult4(result);
  };

  const BasicTable = ({
    columns,
    rows,
  }: {
    columns: string[];
    rows: any[];
  }) => {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell>{c}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {columns.map((c) => (
                  <TableCell component="th" scope="row">
                    {row[c]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  useEffect(() => {
    getTopRecipesOfTopVisitedRestaurants();
    getMostVisitedRestaurant();
    getRestaurantWithMoreDistinctOrders();
    countUniqueRecipes();
    return () => {};
  }, []);

  return (
    <div>
      <h2>Top Recipes Of Top Visited Restaurants</h2>
      <BasicTable
        columns={[
          "restaurant_name",
          "recipe_name",
          "restaurant_count",
          "recipe_count",
        ]}
        rows={result1}
      />
      <h2>Most Visited Restaurants</h2>
      <BasicTable
        columns={["restaurant_name", "number_of_visitors"]}
        rows={result2}
      />

      <h2>Restaurant With More Distinct Orders</h2>

      <BasicTable
        columns={["restaurant_name", "number_of_total_orders"]}
        rows={result3}
      />

      <h2>Count Unique Recipes</h2>
      <BasicTable
        columns={["restaurant_name", "unique_recipes"]}
        rows={result4}
      />
    </div>
  );
}
