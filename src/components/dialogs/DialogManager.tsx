import AlertDialog, { AlertDialogProps } from "./AlertDialog";
import CustomDialog, { CustomDialogProps } from "./CustomDialog";
import FormDialog, { FormDialogProps } from "./FormDialog";
import FullScreenDialog, { FullScreenDialogProps } from "./FullScreenDialog";
import ResponsiveDialog, { ResponsiveDialogProps } from "./ResponsiveDialog";
export type DialogManagerType =
  | "confirm"
  | "form"
  | "custom"
  | "responsive"
  | "fullscreen";

export interface BaseDialogManagerProps {
  type: DialogManagerType;
  open: boolean;
  handleClose: () => void;
  title?: string;
  description?: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmDialogManagerProps extends BaseDialogManagerProps {
  type: "confirm";
  dialogProps: AlertDialogProps;
}
interface FormDialogManagerProps extends BaseDialogManagerProps {
  type: "form";
  dialogProps: FormDialogProps;
}

interface CustomDialogManagerProps extends BaseDialogManagerProps {
  type: "custom";
  dialogProps: CustomDialogProps;
}

interface ResponsiveDialogManagerProps extends BaseDialogManagerProps {
  type: "responsive";
  dialogProps: FormDialogProps;
}

interface FullscreenDialogManagerProps extends BaseDialogManagerProps {
  type: "fullscreen";
  dialogProps: FormDialogProps;
}

export type DialogManagerProps =
  | ConfirmDialogManagerProps
  | FormDialogManagerProps
  | CustomDialogManagerProps
  | ResponsiveDialogManagerProps
  | FullscreenDialogManagerProps;

export interface BaseDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function DialogManager({
  type,
  open,
  handleClose,
  dialogProps,
}: DialogManagerProps) {
  switch (type) {
    case "confirm":
      return (
        <AlertDialog
          dialogProps={dialogProps as AlertDialogProps}
          open={open}
          handleClose={handleClose}
        />
      );
    case "form":
      return (
        <FormDialog
          dialogProps={dialogProps as FormDialogProps}
          open={open}
          handleClose={handleClose}
        />
      );
    case "custom":
      return (
        <CustomDialog
          dialogProps={dialogProps as CustomDialogProps}
          open={open}
          handleClose={handleClose}
        />
      );
    case "responsive":
      return (
        <ResponsiveDialog
          dialogProps={dialogProps as ResponsiveDialogProps}
          open={open}
          handleClose={handleClose}
        />
      );
    case "fullscreen":
      return (
        <FullScreenDialog
          dialogProps={dialogProps as FullScreenDialogProps}
          open={open}
          handleClose={handleClose}
        />
      );
    default:
      return <></>;
  }
}
