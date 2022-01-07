import { Container, CssBaseline } from "@mui/material";
import { UserApi } from "api";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "types";

export default function UserOperation() {
  let { userId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [user, setuser] = useState<User>();
  const navigate = useNavigate();

  const fetchUser = async () => {
    if (!userId) return;
    try {
      const user = await UserApi.find(userId);
      setuser(user);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  useEffect(() => {
    fetchUser();
    return () => {};
  }, []);

  if (!userId) return <h1>User Not Found</h1>;

  // nome: string;
  // email: string;
  // descrizione: string;
  // tipologia: string;

  return (
    <Container style={{ margin: 100 }}>
      <CssBaseline />
      <div>
        <code>{JSON.stringify(user, null, 2)}</code>
      </div>
    </Container>
  );
}
