import { Button } from "@mui/material";
import { useState } from "react";
import {
  DialogManagerProps,
  DialogManagerType,
} from "components/dialogs/DialogManager";
import DialogManagerFactory from "components/dialogs/DialogManagerFactory";
import { AlertDialogProps } from "components/dialogs/AlertDialog";
import { FormDialogProps } from "components/dialogs/FormDialog";
import { CustomDialogProps } from "components/dialogs/CustomDialog";
import { ResponsiveDialogProps } from "components/dialogs/ResponsiveDialog";

type DialogsVisible = Record<DialogManagerType, boolean>;
const OFF_VISIBILITIES: DialogsVisible = {
  confirm: false,
  form: false,
  custom: false,
  responsive: false,
  fullscreen: false,
};

export default function MultiDialogExample() {
  const [dialogsVisible, setDialogsVisible] =
    useState<DialogsVisible>(OFF_VISIBILITIES);
  const keys: DialogManagerType[] = Object.keys(
    dialogsVisible
  ) as DialogManagerType[];

  const setDialogVisibility = (key: DialogManagerType, visible: boolean) => {
    const visibility: DialogsVisible = { ...OFF_VISIBILITIES };
    visibility[key] = visible;
    setDialogsVisible({ ...visibility });
  };

  const confirmDialogProps: AlertDialogProps = {
    title: "Lo sapevi che 4+4 fa 8?",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    onConfirm: () => {
      setDialogVisibility("confirm", false);
      console.log("CONFERMATO");
    },
    confirmText: "pazzesco!",
    cancelText: "non lo sapevo",
  };
  const formDialogProps: FormDialogProps = {};
  const customDialogProps: CustomDialogProps = {};
  const responsiveDialogProps: ResponsiveDialogProps = {};
  const fullscreenDialogProps: FormDialogProps = {};

  const dialogProps = {
    confirm: confirmDialogProps,
    form: formDialogProps,
    custom: customDialogProps,
    responsive: responsiveDialogProps,
    fullscreen: fullscreenDialogProps,
  };

  const dialogManagerFactoryProps: DialogManagerProps[] = keys.map((key) => {
    const res: DialogManagerProps = {
      type: key,
      open: dialogsVisible[key],
      handleClose: () => setDialogVisibility(key, false),
      dialogProps: dialogProps[key],
    };
    return res;
  });

  const renderButton = ({
    title,
    key,
  }: {
    title: string;
    key: DialogManagerType;
  }) => {
    return (
      <Button
        variant="contained"
        className="m12 flex"
        onClick={() => setDialogVisibility(key, true)}
      >
        {title}
      </Button>
    );
  };

  const BUTTONS: { title: string; key: DialogManagerType }[] = keys.map(
    (key) => {
      return { key, title: `${key} Dialog` };
    }
  );

  return (
    <div className="flexrow">
      {BUTTONS.map((btn) => renderButton(btn))}
      <DialogManagerFactory dialogs={dialogManagerFactoryProps} />
    </div>
  );
}
