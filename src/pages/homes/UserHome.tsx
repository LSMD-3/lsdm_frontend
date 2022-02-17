import { useState, useEffect } from "react";
import {
  Container,
  Button,
  CssBaseline,
  Tooltip,
  IconButton,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Restaurant } from "types";
import { Table } from "components";
import { Neo4jRestaurantApi, RestaurantApi } from "api";
import { MenuBook } from "@mui/icons-material";
import { TableColumn } from "components/Table";
export default function UserHome() {
  const navigate = useNavigate();
  const [mostLikedRestaurant, setmostLikedRestaurant] = useState<Restaurant[]>(
    []
  );

  const fetchSuggestedRestaurants = async () => {
    const suggestedRestaurants =
      await Neo4jRestaurantApi.getMostLikedRestaurants();
    setmostLikedRestaurant(
      suggestedRestaurants.map((f: any) => {
        return { _id: f.id, nome: f.name };
      })
    );
  };

  useEffect(() => {
    fetchSuggestedRestaurants();
    return () => {};
  }, []);

  const columns: TableColumn[] = [
    { id: "nome", label: "Nome" },
    { id: "tipologia", label: "Tipologia" },
    { id: "email", label: "Email" },
    { id: "comune", label: "Comune" },
    {
      id: "actions",
      label: "Actions",
      render: (data: { _id: string }) => {
        const { _id } = data;
        console.log(data);
        return (
          <div>
            <Tooltip
              title="open menu"
              onClick={() => navigate(`/restaurant/${_id}/menu`)}
            >
              <IconButton>
                <MenuBook />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const renderButton = (children: JSX.Element, onClick?: () => void) => {
    return (
      <Button onClick={onClick} variant="contained" className="m12 flex">
        {children}
      </Button>
    );
  };

  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
      <h2>Most Liked Restaurants</h2>

      {mostLikedRestaurant.map((rest) =>
        renderButton(<h4>{rest.nome}</h4>, () =>
          navigate("/restaurant/" + rest._id)
        )
      )}
      <h2>Restaurants</h2>
      <Table title="Restaurants" columns={columns} api={RestaurantApi} />
    </Container>
  );
}
