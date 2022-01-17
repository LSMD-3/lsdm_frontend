import { Item, MenuRecipe } from "types";

export function extractItemsFromMenuRecipes(recipes: MenuRecipe[]): Item[] {
  return recipes.map((r) => {
    return {
      _id: r._id,
      image_url: r.recipe.image_url,
      name: r.recipe.recipe_name,
    };
  });
}
