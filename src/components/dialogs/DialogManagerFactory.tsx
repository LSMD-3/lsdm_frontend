import DialogManager, { DialogManagerProps } from "./DialogManager";

export default function DialogManagerFactory({
  dialogs,
}: {
  dialogs: DialogManagerProps[];
}) {
  if (dialogs.length === 0) return <></>;
  const renderers: (() => JSX.Element)[] = [];
  dialogs.forEach((dialog) => {
    renderers.push(() => (
      <DialogManager
        dialogProps={dialog.dialogProps}
        type={dialog.type}
        open={dialog.open}
        handleClose={dialog.handleClose}
      />
    ));
  });
  return <div>{renderers.map((r) => r())}</div>;
}
