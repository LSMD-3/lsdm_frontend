import { Typography, Grid, Box } from "@mui/material";
import FlexBox from "../components/layout/FlexBox";
import Images from "../assets/img/Images";
import Footer from "../components/Footer";

export default function ExamplesPage() {
  const Item = ({ image, text }: { image: any; text: string }) => (
    <div style={{ borderRadius: 20 }} className="shadow clickable">
      <img alt="ExamplesPage" src={image} width={"100%"}></img>
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
        <Grid item xs={7} sm={6} md={3}>
          <Item image={Images.image1} text={"Contact Page"} />
        </Grid>
        <Grid item xs={7} sm={6} md={3}>
          <Item image={Images.image2} text={"ART"} />
        </Grid>
        <Grid item xs={7} sm={6} md={3}>
          <Item image={Images.image3} text={"STORE MODA"} />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <div style={{ marginTop: 40 }}>
      <FlexBox direction="column">
        <Typography variant="h2" component="h2">
          EXAMPLES
        </Typography>
      </FlexBox>
      {renderMenu()}
      <Footer />
    </div>
  );
}
