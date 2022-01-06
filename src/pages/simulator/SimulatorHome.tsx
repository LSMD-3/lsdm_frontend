import { Container, CssBaseline } from "@mui/material";
import React from "react";

export default function SimulatorHome() {
  return (
    <Container component="main" maxWidth="xl" style={{ marginTop: 30 }}>
      <CssBaseline />
      Todo list
      <ul>
        <li>
          <b>Single Menu Generator</b>: Choose a restaurant, then set parameters
          for its menu generation
        </li>
        <li>
          <b>Bulk Menu Generator</b>: Generate a menu for all restaurants that
          respect filters appl ied
        </li>
      </ul>
    </Container>
  );
}
