import { Typography, Grid, Box } from "@mui/material";
import FlexBox from "../components/layout/FlexBox";
import Images from "../assets/img/Images";
import Footer from "../components/Footer";
import { useNavigate } from "react-router";

export default function Store() {
  const navigate = useNavigate();
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
          <Item image={Images.image1} text={"DESIGN"} url={"./design"} />
        </Grid>
        <Grid item xs={7} sm={6} md={3}>
          <Item image={Images.image2} text={"ART"} url={"./art"} />
        </Grid>
        <Grid item xs={7} sm={6} md={3}>
          <Item image={Images.image3} text={"STORE MODA"} url={"./moda"} />
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
