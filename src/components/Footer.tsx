import React from "react";
import SvgIcons from "assets/svg/SvgIcons";
import { FlexBox } from "components";

export default function Footer() {
  return (
    <div style={{ marginTop: 100 }}>
      <FlexBox flex={1} justifyContent="center" direction="row">
        <span style={{ marginRight: 16 }}>
          Contattaci&nbsp;
          <a href="mailto: info@react-boilerplate.com">
            <span>info@react-boilerplate.com</span>
          </a>
        </span>
        <SvgIcons icon="Facebook" style={{ marginRight: 16 }} />
        <SvgIcons icon="Instagram" style={{ marginRight: 16 }} />
      </FlexBox>
      <FlexBox flex={1} justifyContent="center" direction="row">
        <span style={{ marginRight: 16 }}>© react-boilerplate 2020 by </span>
      </FlexBox>
    </div>
  );
}
