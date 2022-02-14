import { Item, Menu } from "types";

export function extractItemsFromMenu(menu: Menu): Item[] {
  return menu.recipes.map((r) => {
    return {
      _id: r._id,
      image_url: r.image_url,
      name: r.recipe_name,
    };
  });
}
