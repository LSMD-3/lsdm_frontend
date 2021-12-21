import AlertDialog from "./AlertDialog";
import CustomizedDialogs from "./CustomDialog";
import FormDialog from "./FormDialog";
import FullScreenDialog from "./FullScreenDialog";
import ResponsiveDialog from "./ResponsiveDialog";
export type DialogManagerType =
  | "confirm"
  | "form"
  | "custom"
  | "responsive"
  | "fullscreen";
export interface DialogManagerProps {
  type: DialogManagerType;
  open: boolean;
  handleClose: () => void;
}

export interface BaseDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function DialogManager({
  type,
  open,
  handleClose,
}: DialogManagerProps) {
  switch (type) {
    case "confirm":
      return <AlertDialog open={open} handleClose={handleClose} />;
    case "form":
      return <FormDialog open={open} handleClose={handleClose} />;
    case "custom":
      return <CustomizedDialogs open={open} handleClose={handleClose} />;
    case "responsive":
      return <ResponsiveDialog open={open} handleClose={handleClose} />;
    case "fullscreen":
      return <FullScreenDialog open={open} handleClose={handleClose} />;
    default:
      return <></>;
  }
}
