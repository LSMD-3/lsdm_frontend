import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { BaseDialogProps } from "./DialogManager";

export interface FormDialogProps {
  title?: string;
  description?: string;
  onConfirm?: (text: string) => void;
  confirmText?: string;
  cancelText?: string;
  defaultValue?: string;
}
interface Props extends BaseDialogProps {
  dialogProps: FormDialogProps;
}
export default function FormDialog({ open, handleClose, dialogProps }: Props) {
  const [newText, setnewText] = useState("");
  const {
    title,
    description,
    onConfirm,
    confirmText,
    cancelText,
    defaultValue,
  } = dialogProps;
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            defaultValue={defaultValue}
            type="text"
            fullWidth
            variant="standard"
            onChange={(event) => setnewText(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{cancelText ?? "Cancel"}</Button>
          <Button
            onClick={(res) => {
              setnewText("");
              onConfirm && onConfirm(newText);
            }}
          >
            {confirmText ?? "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
