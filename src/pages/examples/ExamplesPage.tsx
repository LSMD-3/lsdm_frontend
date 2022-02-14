import {
  Typography,
  Grid,
  Box,
  Button,
  Container,
  CssBaseline,
} from "@mui/material";
import { FlexBox, Footer, DialogManager, CardItem } from "components";
import { useState } from "react";
import HooksExample from "./HooksExample";
import SpringAnimationsExample from "./SpringAnimationsExample";
import Images from "assets/img/Images";

export default function ExamplesPage() {
  // IF YOU NEED ONLY A MODAL IN THE PAGE
  const [modalOpen, set_modalOpen] = useState(false);

  const Menu = () => (
    <Box sx={{ flexGrow: 1 }} style={{ marginTop: 50 }}>
      <Grid
        container
        spacing={{ xs: 6, sm: 6, md: 3 }}
        columnGap={{ md: 6 }}
        columns={{ xs: 8, sm: 8, md: 12 }}
        justifyContent="center"
      >
        <Grid item xs={7} sm={6} md={3}>
          <h3>Modals Example</h3>
          <Button
            variant="contained"
            className="m12 flex"
            onClick={() => set_modalOpen(true)}
          >
            Open Modal
          </Button>
          <DialogManager
            type="confirm"
            open={modalOpen}
            handleClose={() => set_modalOpen(false)}
            dialogProps={{
              title: "Lo sapevi che 2+2 fa 4?",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
              onConfirm: () => {
                set_modalOpen(false);
                console.log("CONFERMATO");
              },
            }}
          />
        </Grid>
        <Grid item xs={7} sm={6} md={3}>
          <h3>Hooks Example</h3>
          <p>
            Hooks are objects that change its internal status according to
            events they are hooked to. Their internal state can be changed only
            by events hooked and not programmatically. We can use them to attach
            UI behaviour to them
          </p>
          <p>
            Gli hooks sono oggetti che cambiano stato in base a determinati
            eventi. Servono a centralizzare la logica e evitare ripetizioni di
            codice, prova ad esempio a restringere questa scheda..
          </p>
          <HooksExample />
        </Grid>
        <Grid item xs={7} sm={6} md={3}>
          <h3>Reducer Example</h3>
          <p>
            Reducer are powerful tools that allow us to have global state in the
            app. They have an internal state that can be updated with{" "}
            <b>actions</b>. Their state can be observed by UI components. Some
            use case of that are:
          </p>
          <ul>
            <li>Cart Item handling</li>
            <li>Like handling</li>
          </ul>
          <Button>Visit store</Button>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Container component="main" style={{ marginTop: 40 }}>
      <CssBaseline />

      <Box sx={{ flexGrow: 1 }} style={{ marginTop: 50 }}>
        <Grid
          container
          spacing={{ xs: 6, sm: 6, md: 3 }}
          columnGap={{ md: 6 }}
          columns={{ xs: 8, sm: 8, md: 12 }}
          justifyContent="center"
        >
          <Grid item xs={6} sm={6} md={3}>
            <CardItem
              image={Images.image1}
              text={"EXAMPLES"}
              url={"/examples"}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <CardItem image={Images.image2} text={"PROFILE"} url={"/profile"} />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <CardItem image={Images.image3} text={"STORE"} url={"/menu"} />
          </Grid>
        </Grid>
      </Box>
      <FlexBox direction="column">
        <Typography variant="h2" component="h2">
          EXAMPLES
        </Typography>
      </FlexBox>
      <Menu />

      <SpringAnimationsExample />
      <Footer />
    </Container>
  );
}
