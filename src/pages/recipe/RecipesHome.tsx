import { RecipeApi } from "api";
import React, { useEffect } from "react";

export default function RecipesHome() {
  const fetchRecipes = async () => {
    try {
      const res = await RecipeApi.search();
    } catch (e) {}
  };
  useEffect(() => {
    fetchRecipes();
    return () => {};
  }, []);
  return <div>RecipesHome</div>;
}
