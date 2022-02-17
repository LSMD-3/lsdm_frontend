import { useState, useEffect } from "react";
import {
  Container,
  Button,
  CssBaseline,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Restaurant } from "types";
import { RestaurantApi, TableApi } from "api";
import { useSelector } from "react-redux";
import store, { userState } from "redux/store";
import { useSnackbar } from "notistack";

export default function AdminHome() {
  const navigate = useNavigate();
  const user = useSelector(userState);
  const [myRestaurant, setmyRestaurant] = useState<Restaurant>();
  const [result, setResult] = useState<any[]>([]);

  const { enqueueSnackbar } = useSnackbar();
  const myRestaurantId = user.user?.joinedRestaurant?._id;

  const fetchMyRestaurant = async () => {
    if (myRestaurantId) {
      try {
        const restaurant = await RestaurantApi.find(myRestaurantId);
        setmyRestaurant(restaurant);
      } catch (error) {
        enqueueSnackbar("restaurant not found", { variant: "error" });
      }
    }
  };

  const fetchMostOrderedRecipes = async (myRestaurantId: any) => {
    if (!myRestaurantId) return;
    try {
      console.log("HERE");
      const recipes = await TableApi.getMostOrderedRecipes(myRestaurantId);
      setResult(recipes);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  useEffect(() => {
    fetchMyRestaurant();
    fetchMostOrderedRecipes(myRestaurantId);

    return () => {};
  }, []);

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

  const joinedRestaurant = user.user?.joinedRestaurant;
  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />

      {user.user?.userType !== "super-admin" && myRestaurant && (
        <div>
          <h2>{myRestaurant.nome}</h2>
          <span>
            {myRestaurant.email} - {myRestaurant.tipologia} -{" "}
            {myRestaurant.comune}
          </span>
          <div style={{ marginTop: 30 }}>
            <Button
              variant="contained"
              onClick={() => navigate(`/restaurant/${myRestaurant._id}/edit`)}
            >
              Edit Restaurant
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate(`/restaurant/${myRestaurant._id}/menu`)}
              style={{ marginLeft: 20 }}
            >
              Open Menu
            </Button>
            <h2>Top 10 Ordered Recipes</h2>
            <BasicTable
              columns={["_id", "recipe_name", "count"]}
              rows={result}
            />
          </div>
        </div>
      )}
    </Container>
  );
}
