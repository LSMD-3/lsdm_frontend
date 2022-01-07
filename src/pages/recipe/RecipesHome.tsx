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
    {
      id: "recipe_link",
      label: "Image",
      render: (recipe: Recipe) => {
        const { image_url, recipe_name } = recipe;
        return (
          <a href={image_url} target={"_blank"}>
            <img src={image_url} height={40} alt={recipe_name}></img>
          </a>
        );
      },
    },
    { id: "recipe_name", label: "Nome Ricetta" },
    {
      id: "actions",
      label: "Actions",
      render: (recipe: Recipe) => {
        const { _id } = recipe;
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

  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
      <Table title="Recipes" columns={columns} api={RecipeApi} />
    </Container>
  );
}
