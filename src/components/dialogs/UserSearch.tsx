import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { User } from "types";
import { SearchBar } from "components";
import { UserApi } from "api";
import { useSnackbar } from "notistack";

interface UserSearchProps {
  onUserAdded?: (user: User) => void;
}

export default function UserSearch(props: UserSearchProps) {
  const { onUserAdded } = props;

  const [selectedUser, setselectedUser] = useState<User>();
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

  const addUser = async () => {
    if (!selectedUser) return;
    try {
      onUserAdded && onUserAdded(selectedUser);
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
        onClick={addUser}
        fullWidth
      >
        Add User
      </Button>
    </div>
  );
}
