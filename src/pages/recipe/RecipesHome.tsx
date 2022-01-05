import { RecipeApi } from "api";
import { Table } from "components";
import { TableColumn } from "components/Table";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Recipe } from "types";
import { useSnackbar } from "notistack";

export default function RecipesHome() {
  const [items, setitems] = useState<Recipe[]>([]);
  const [page, setpage] = useState(0);
  const [pageSize, setpageSize] = useState(10);
  const [totalCount, settotalCount] = useState<number>(0);
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchRecipe = async () => {
    try {
      const res = await RecipeApi.search({
        limit: pageSize,
        offset: page * pageSize,
      });
      setitems(res);
      setloading(false);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  const fetchTotalCount = async () => {
    try {
      const res = await RecipeApi.count();
      console.log({ res });
      settotalCount(res);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  useEffect(() => {
    fetchRecipe();
    return () => {};
  }, [page, pageSize]);

  useEffect(() => {
    fetchRecipe();
    fetchTotalCount();
    return () => {};
  }, []);

  const columns: TableColumn[] = [
    { id: "recipe_name", label: "Nome Ricetta" },
    { id: "recipe_link", label: "Link" },
  ];

  const openRecipeDetails = (recipe: Recipe) => {
    navigate("/recipe/" + recipe._id);
  };

  return (
    <div style={{ marginRight: 20, marginLeft: 20, marginTop: 20 }}>
      <Table
        loading={loading}
        totalRows={totalCount}
        rows={items}
        columns={columns}
        page={page}
        title="Ricette disponibili"
        rowsPerPage={pageSize}
        handleChangeRowsPerPage={setpageSize}
        handleChangePage={setpage}
        onRowClick={openRecipeDetails}
      />
    </div>
  );
}
