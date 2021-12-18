import * as React from "react";
import { ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";

import { About, Contact, ExamplesPage, Home, NotFound, Store } from "./pages";
import TopNavigation from "./navigation/components/TopNavigation";

import { createTheme } from "@mui/material/styles";
import StoreCategorized from "./pages/StoreCategorized";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        light: "#757ce8",
        main: "#3f50b5",
        dark: "#002884",
        contrastText: "#fff",
      },
      secondary: {
        light: "#ff7961",
        main: "#f44336",
        dark: "#ba000d",
        contrastText: "#000",
      },
    },
  });
  return (
    <div>
      <ThemeProvider theme={theme}>
        <TopNavigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="store/:category" element={<StoreCategorized />} />
          <Route path="store" element={<Store />} />
          <Route path="contact" element={<Contact />} />
          <Route path="examples" element={<ExamplesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
