import { Typography, Grid, Box } from "@mui/material";
import { FlexBox, Footer, CardItem } from "components";
import Images from "assets/img/Images";

export default function Store() {
  const renderMenu = () => (
    <Box sx={{ flexGrow: 1 }} style={{ marginTop: 50 }}>
      <Grid
        container
        spacing={{ xs: 6, sm: 6, md: 3 }}
        columnGap={{ md: 6 }}
        columns={{ xs: 8, sm: 8, md: 12 }}
        justifyContent="center"
      >
        <Grid item xs={7} sm={6} md={3}>
          <CardItem image={Images.image1} text={"DESIGN"} url={"./design"} />
        </Grid>
        <Grid item xs={7} sm={6} md={3}>
          <CardItem image={Images.image2} text={"ART"} url={"./art"} />
        </Grid>
        <Grid item xs={7} sm={6} md={3}>
          <CardItem image={Images.image3} text={"STORE MODA"} url={"./moda"} />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <div style={{ marginTop: 40 }}>
      <FlexBox direction="column">
        <Typography variant="h2" component="h2">
          STORE
        </Typography>
      </FlexBox>
      {renderMenu()}
      <Footer />
    </div>
  );
}
