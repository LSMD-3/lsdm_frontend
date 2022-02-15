import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Recipe } from "types";
interface RecipeModalProps {
  open: boolean;
  handleClose: () => void;
  recipe?: Recipe;
}
export default function RecipeModal({
  open,
  handleClose,
  recipe,
}: RecipeModalProps) {
  if (!recipe) return <div></div>;
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{recipe.recipe_name}</DialogTitle>
      <LazyLoadImage effect="blur" src={recipe.image_url} width={"100%"} />

      <span style={{ padding: 30 }}>
        {recipe.ingredients.reduce((curr, acc) => curr + acc + ", ", "")}
      </span>
      <DialogActions>
        <Button onClick={handleClose}>{"Close"}</Button>
        {/* <Button onClick={onConfirm} autoFocus>
          {confirmText ?? "Agree"}
        </Button> */}
      </DialogActions>
    </Dialog>
  );
}
