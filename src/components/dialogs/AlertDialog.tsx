import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { BaseDialogProps } from "./DialogManager";

export interface AlertDialogProps {
  title?: string;
  description?: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface Props extends BaseDialogProps {
  dialogProps: AlertDialogProps;
}

export default function AlertDialog({ open, handleClose, dialogProps }: Props) {
  const { title, description, onConfirm, confirmText, cancelText } =
    dialogProps;
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {title ?? "Missing title in this modal"}
      </DialogTitle>
      {description && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={handleClose}>{cancelText ?? "Disagree"}</Button>
        <Button onClick={onConfirm} autoFocus>
          {confirmText ?? "Agree"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
