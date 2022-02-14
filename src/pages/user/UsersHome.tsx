import { AuthenticationApi, UserApi } from "api";
import { Table } from "components";
import { TableColumn } from "components/Table";
import { useNavigate } from "react-router-dom";
import { User } from "types";
import { useSnackbar } from "notistack";
import {
  Button,
  Container,
  CssBaseline,
  IconButton,
  Tooltip,
} from "@mui/material";
import FakerFactory from "generators/faker";
import { ModeEdit, VerifiedUserOutlined } from "@mui/icons-material";

export default function UserHome() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const columns: TableColumn[] = [
    { id: "name", label: "Nome" },
    { id: "surname", label: "Cognome" },
    { id: "email", label: "Email" },
    { id: "userType", label: "User Type" },
    {
      id: "actions",
      label: "Actions",
      render: (data: { _id: string }) => {
        const { _id } = data;
        console.log(data);
        return (
          <div>
            <Tooltip
              title="edit user"
              onClick={() => navigate(`/user/${_id}/edit`)}
            >
              <IconButton>
                <ModeEdit />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const generateUsers = async (count: number) => {
    // TODO change this putting a singnir rather than a user add
    const users = FakerFactory.createUsers(count);
    const promises: any[] = [];
    users.forEach((user) => {
      promises.push(
        AuthenticationApi.signup(
          user.email!,
          "Password1!",
          user.name!,
          user.surname!
        )
      );
    });
    try {
      await Promise.all(promises);
      enqueueSnackbar(`${count} utenti creati`, { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
      <Button
        variant="contained"
        onClick={() => navigate("/user/create")}
        style={{ marginBottom: 20 }}
      >
        Create User
      </Button>
      <Button onClick={() => generateUsers(10)}>Generate Bulk 10</Button>
      <Button onClick={() => generateUsers(100)}>Generate Bulk 100</Button>
      <Button onClick={() => generateUsers(500)}>Generate Bulk 500</Button>
      <Table title="Users" columns={columns} api={UserApi} />
    </Container>
  );
}
