import React, { useEffect, useState } from "react";
import { TextField, Typography, Grid, Box, Button } from "@mui/material";
import { SpringModal, FlexBox, Footer, CardItem } from "components";

import Images from "assets/img/Images";

export default function CodiceFiscale() {
  const [name, setName] = useState<string>();
  const [surn, setSurn] = useState<string>();

  let email = "";

  /*useEffect(() => {
    if (!IS_DEV) setTimeout(() => setOpen(true), 2000);
    return () => {};
  }, []);*/

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("firstName")?.toString();
    setName(name);
    const surn = data.get("lastName")?.toString();
    setSurn(surn);
    console.log("submit");
  };

  return (
    <div>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              name="firstName"
              required
              fullWidth
              id="firstName"
              label="First Name"
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
      </Box>
      <h2>Calcolo Codice Fiscale</h2>
      {name !== undefined && <span>{name}</span>}
      {surn !== undefined && <span>{surn}</span>}
      <Footer />
    </div>
  );
}
