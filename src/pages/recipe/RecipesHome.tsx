import { RecipeApi } from "api";
import { Table } from "components";
import { TableColumn } from "components/Table";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Recipe } from "types";
import { useSnackbar } from "notistack";
import { Container, CssBaseline, IconButton, Tooltip } from "@mui/material";
import { ModeEdit } from "@mui/icons-material";

export default function RecipesHome() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const columns: TableColumn[] = [
    { id: "recipe_name", label: "Nome Ricetta" },
    { id: "recipe_link", label: "Link" },
    {
      id: "actions",
      label: "Actions",
      render: (data: { _id: string }) => {
        const { _id } = data;
        return (
          <div>
            <Tooltip
              title="edit user"
              onClick={() => navigate(`/recipe/${_id}/edit`)}
            >
              <IconButton>
                <ModeEdit />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const openRecipeDetails = (recipe: Recipe) => {
    navigate("/recipe/" + recipe._id);
  };

  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
      <Table
        title="Recipes"
        columns={columns}
        onRowClick={openRecipeDetails}
        deleteApi={RecipeApi.delete}
        searchApi={RecipeApi.search}
        countApi={RecipeApi.count}
      />
    </Container>
  );
}
