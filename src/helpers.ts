import { Item, Menu } from "types";

export function extractItemsFromMenu(menu: Menu): Item[] {
  return menu.recipes.map((r) => {
    return {
      _id: r.recipe._id,
      image_url: r.recipe.image_url,
      name: r.recipe.recipe_name,
    };
  });
}
