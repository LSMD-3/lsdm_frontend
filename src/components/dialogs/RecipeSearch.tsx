import { Recipe } from "types";
import { SearchBar } from "components";
import { RecipeApi } from "api";
import { useSnackbar } from "notistack";

interface RecipeSearchProps {
  onRecipeSelected: (recipe?: Recipe) => void;
}

export default function RecipeSearch({ onRecipeSelected }: RecipeSearchProps) {
  const { enqueueSnackbar } = useSnackbar();

  const searchRecipes = async (text: string): Promise<Recipe[]> => {
    try {
      const users = await RecipeApi.search({
        like: { field: "recipe_name", value: text, caseSensitive: false },
      });
      return users;
    } catch (error: any) {
      enqueueSnackbar("Recipe not found", { variant: "error" });
    }
    return [];
  };

  return (
    <div style={{ marginTop: 30, padding: 10 }}>
      <SearchBar<Recipe>
        searchApi={searchRecipes}
        onSelectOption={(recipe: Recipe) => onRecipeSelected(recipe)}
        keyExtractor={(u) => u._id}
        labelExtractor={(u) => u.recipe_name}
        label="Search by recipe name"
      />
    </div>
  );
}
