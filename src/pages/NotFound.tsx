import { Button } from "@mui/material";
import SvgIcons from "assets/svg/SvgIcons";
import { FlexBox } from "components";

export default function NotFound() {
  return (
    <FlexBox direction="column">
      <h1>Page Not found</h1>
      <SvgIcons icon="404" />
      <Button variant="contained" href="/" style={{ marginTop: 40 }}>
        Return To Home
      </Button>
    </FlexBox>
  );
}
