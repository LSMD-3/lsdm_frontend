import List from "@mui/material/List";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

import UserSearch from "./UserSearch";
import { User } from "types";

interface SearchUserModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onUserAdded?: (user: User) => void;
}

export default function SearchUserModal(props: SearchUserModalProps) {
  const { onClose, open, onUserAdded, title } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {onUserAdded && <UserSearch onUserAdded={onUserAdded} />}
      </List>
    </Dialog>
  );
}
