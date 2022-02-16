import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Switch,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Recipe } from "types";
interface CreateMenuModalProps {
  open: boolean;
  handleClose: () => void;
  onConfirm: (name: string, ayce: boolean, price?: number) => void;
}
export default function CreateMenuModal({
  open,
  handleClose,
  onConfirm,
}: CreateMenuModalProps) {
  const [menuName, setmenuName] = useState("");
  const [ayce, setayce] = useState(false);
  const [price, setprice] = useState<number>();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Create a new Menu</DialogTitle>
      <TextField
        label="Menu name"
        type="text"
        autoFocus
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) => setmenuName(e.target.value)}
        style={{ minWidth: 400, margin: 20 }}
      />

      <div style={{ marginLeft: 20 }}>
        All you can eat?
        <Switch
          defaultChecked={false}
          onChange={(e, value) => setayce(value)}
        />
      </div>

      {ayce && (
        <TextField
          label="Menu Price"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setprice(Number(e.target.value))}
          style={{ minWidth: 400, margin: 20 }}
        />
      )}

      <DialogActions>
        <Button onClick={handleClose}>{"Close"}</Button>
        <Button onClick={() => onConfirm(menuName, ayce, price)}>
          {"Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
