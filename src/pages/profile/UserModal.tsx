import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";
import UserSearch from "./UserSearch";
import { User } from "types";

interface UserModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  users: User[];
  onClick: (userId: string) => void;
  onUserAdded?: () => void;
}

export function UserModal(props: UserModalProps) {
  const { onClose, open, users, onClick, onUserAdded, title } = props;

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value: string) => {
    onClick(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {users.map((user) => (
          <ListItem
            button
            onClick={() => handleListItemClick(user.id!)}
            key={user.id!}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.email} />
          </ListItem>
        ))}
        {onUserAdded && <UserSearch onUserAdded={onUserAdded} />}
      </List>
    </Dialog>
  );
}
