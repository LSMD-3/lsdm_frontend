import React, { useEffect } from "react";
import { TextField, Typography, Grid, Box, Button } from "@mui/material";
import SpringModal from "../components/SpringModal";
import FlexBox from "../components/layout/FlexBox";
import { IS_DEV } from "../config";

import Images from "../assets/img/Images";
import Footer from "../components/Footer";
import { useNavigate } from "react-router";

export default function Home() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

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

  const Item = ({
    image,
    text,
    url,
  }: {
    image: any;
    text: string;
    url: string;
  }) => (
    <div
      style={{ borderRadius: 20 }}
      className="shadow clickable"
      onClick={() => navigate(url)}
    >
      <img alt={text} src={image} width={"100%"} height={400}></img>
      <Typography
        id="spring-modal-title"
        variant="h5"
        component="h2"
        style={{ textAlign: "center", paddingTop: 10, paddingBottom: 10 }}
      >
        {text}
      </Typography>
    </div>
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
          <Item image={Images.image1} text={"EXAMPLES"} url={"/examples"} />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Item image={Images.image2} text={"ABOUT US"} url={"/about"} />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Item image={Images.image3} text={"STORE"} url={"/store"} />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <div>
      {renderMenu()}
      {renderModal()}
      <Footer />
    </div>
  );
}
