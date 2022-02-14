import {
  TextField,
  Button,
  Container,
  CssBaseline,
  Grid,
  Typography,
  CircularProgress,
  List,
  ListItem,
  IconButton,
  ListItemText,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Restaurant, User } from "types";
import DeleteIcon from "@mui/icons-material/Delete";
import { SearchUserModal } from "components";

interface StaffHandlerProps {
  staffType: "Chef" | "Admin" | "Waiter";
  users: User[];
  onUsersUpdate: (users: User[]) => void;
}

export default function StaffHandler({
  staffType,
  users,
  onUsersUpdate,
}: StaffHandlerProps) {
  const [open, setopen] = useState(false);

  const openAddChef = () => {
    setopen(true);
  };

  const addStaff = (user: User) => {
    users.push(user);
    setopen(false);
    onUsersUpdate([...users]);
  };

  const deleteStaff = (index: number) => {
    users.splice(index, 1);
    onUsersUpdate([...users]);
  };

  const Demo = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));

  return (
    <div>
      <Grid>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 30,
          }}
        >
          <Typography variant="h6" component="div">
            {staffType}s
          </Typography>
          <Button variant="contained" onClick={openAddChef}>
            Add {staffType}
          </Button>
        </div>
        <Demo>
          <List dense={true}>
            {users.map((user, idx) => (
              <ListItem
                key={user._id}
                secondaryAction={
                  <div>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteStaff(idx)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                }
              >
                <ListItemText primary={user.name + " " + user.surname} />
              </ListItem>
            ))}
          </List>
        </Demo>
      </Grid>

      <SearchUserModal
        open={open}
        onClose={() => {
          setopen(false);
        }}
        onUserAdded={(user) => addStaff(user)}
        title={"Add chef"}
      />
    </div>
  );
}
