import List from "@mui/material/List";
import { useEffect, useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Button, TextField } from "@mui/material";
import RecipeSearch from "./RecipeSearch";
import { MenuRecipe, Recipe } from "types";

interface SearchRecipeModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onRecipeAdded: (recipe: MenuRecipe) => void;
}

export default function SearchRecipeModal(props: SearchRecipeModalProps) {
  const { onClose, open, onRecipeAdded, title } = props;
  const [selectedRecipe, setselectedRecipe] = useState<Recipe>();
  const [price, setprice] = useState<number>(4);
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>

      <RecipeSearch onRecipeSelected={setselectedRecipe} />

      <TextField
        id="total"
        name="total"
        label="Recipe Price in €"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        defaultValue={price}
        onChange={(e) => setprice(Number(e.target.value))}
        style={{ margin: 20 }}
      />

      <Button
        variant="contained"
        disabled={!selectedRecipe}
        style={{ marginTop: 20 }}
        onClick={
          selectedRecipe
            ? () => onRecipeAdded({ ...selectedRecipe, price })
            : undefined
        }
        fullWidth
      >
        Add Recipe
      </Button>
    </Dialog>
  );
}
