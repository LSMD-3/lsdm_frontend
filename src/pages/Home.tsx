import React, { useEffect, useState } from "react";
import {
  TextField,
  Typography,
  Grid,
  Box,
  Button,
  CssBaseline,
} from "@mui/material";
import { SpringModal, FlexBox, Footer, CardItem } from "components";

import { IS_DEV } from "../config";

import Images from "assets/img/Images";

export default function Home() {
  const [open, setOpen] = useState(false);

  let email = "";

  useEffect(() => {
    if (!IS_DEV) setTimeout(() => setOpen(true), 2000);
    return () => {};
  }, []);

  const onConfirmSubscription = () => {
    console.log("subscription confirmed for " + email);
    setOpen(false);
  };

  const renderModal = () => (
    <SpringModal open={open} handleClose={() => setOpen(false)}>
      <Typography id="spring-modal-title" variant="h6" component="h2">
        Nuovi pezzi in arrivo
      </Typography>
      <Typography id="spring-modal-description" sx={{ mt: 2 }}>
        Registrati alla nostra news letter
      </Typography>
      <FlexBox>
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          style={{ flex: 5 }}
          onChange={(e) => (email = e.target.value)}
        />
        <Button
          variant="text"
          onClick={onConfirmSubscription}
          style={{ flex: 1 }}
        >
          Iscriviti
        </Button>
      </FlexBox>
    </SpringModal>
  );

  const renderMenu = () => (
    <Box sx={{ flexGrow: 1 }} style={{ marginTop: 50 }}>
      <Grid
        container
        spacing={{ xs: 6, sm: 6, md: 3 }}
        columnGap={{ md: 6 }}
        columns={{ xs: 8, sm: 8, md: 12 }}
        justifyContent="center"
      >
        <Grid item xs={6} sm={6} md={3}>
          <CardItem image={Images.image1} text={"EXAMPLES"} url={"/examples"} />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <CardItem image={Images.image2} text={"PROFILE"} url={"/profile"} />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <CardItem image={Images.image3} text={"STORE"} url={"/store"} />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <div>
      <CssBaseline />
      {renderMenu()}
      {renderModal()}
      <Footer />
    </div>
  );
}
