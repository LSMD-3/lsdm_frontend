import { Button } from "@mui/material";
import { useState } from "react";
import {
  DialogManagerProps,
  DialogManagerType,
} from "../../components/dialogs/DialogManager";
import DialogManagerFactory from "../../components/dialogs/DialogManagerFactory";

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

  // Base Props of modals
  const dialogManagerFactoryProps: DialogManagerProps[] = keys.map((key) => {
    const visibility: DialogsVisible = { ...OFF_VISIBILITIES };
    visibility[key] = false;
    return {
      open: dialogsVisible[key],
      handleClose: () => setDialogsVisible({ ...visibility }),
      type: key,
    };
  });

  const renderButton = ({
    title,
    key,
  }: {
    title: string;
    key: DialogManagerType;
  }) => {
    const visibility: DialogsVisible = { ...OFF_VISIBILITIES };
    visibility[key] = true;

    return (
      <Button
        variant="contained"
        className="m12 flex"
        onClick={() => setDialogsVisible(visibility)}
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
