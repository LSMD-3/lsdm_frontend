import { Typography } from "@mui/material";
import { Footer, FlexBox } from "components";

export default function About() {
  return (
    <div style={{ marginTop: 40 }}>
      <FlexBox direction="column">
        <Typography variant="h2" component="h2">
          ABOUT US
        </Typography>
      </FlexBox>
      <Footer />
    </div>
  );
}
