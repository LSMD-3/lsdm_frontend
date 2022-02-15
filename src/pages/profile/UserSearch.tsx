import { useEffect, useState } from "react";
import {
  Container,
  Button,
  CssBaseline,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Restaurant, User } from "types";
import { ItemList, SearchBar, DialogManager } from "components";
import { RestaurantApi, UserApi, Neo4jUserApi } from "api";
import { useSnackbar } from "notistack";
import { userState } from "redux/store";
import { useSelector } from "react-redux";
import { UserModal } from "./UserModal";

interface UserSearchProps {
  onUserAdded?: () => void;
}

export default function UserSearch(props: UserSearchProps) {
  const { onUserAdded } = props;

  const [selectedUser, setselectedUser] = useState<User>();
  const user = useSelector(userState);
  const { enqueueSnackbar } = useSnackbar();

  const searchUsers = async (text: string): Promise<User[]> => {
    try {
      const users = await UserApi.search({
        like: { field: "email", value: text, caseSensitive: false },
      });
      return users;
    } catch (error: any) {
      enqueueSnackbar("User not found", { variant: "error" });
    }
    return [];
  };

  const addFriend = async () => {
    if (!selectedUser) return;
    try {
      await Neo4jUserApi.followUser(user.user!._id, selectedUser._id);
      onUserAdded && onUserAdded();
    } catch (error: any) {
      enqueueSnackbar("Cannot add this user to friends", { variant: "error" });
    }

    return [];
  };

  return (
    <div style={{ marginTop: 30, padding: 10 }}>
      <SearchBar<User>
        searchApi={searchUsers}
        onSelectOption={(user: User) => setselectedUser(user)}
        keyExtractor={(u) => u._id}
        labelExtractor={(u) => u.email}
        label="Search by email"
      />

      <Button
        variant="contained"
        disabled={!selectedUser}
        style={{ marginTop: 20 }}
        onClick={addFriend}
        fullWidth
      >
        Add Friend
      </Button>
    </div>
  );
}
