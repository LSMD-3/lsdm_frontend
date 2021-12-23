import * as React from "react";
import { CircularProgress, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";

import {
  About,
  Contact,
  ExamplesPage,
  Home,
  NotFound,
  Store,
  StoreCategorized,
} from "pages";
import { TopNavigation } from "navigation";

import { createTheme } from "@mui/material/styles";
import useWindowsWidth from "hooks/useWindowWidth";

import { useState } from "react";
import sleep from "utils/helper";
import AppStore from "stores/AppStore";

// interface UserMethods {

//   loadInitialData: (tokenProvider: (uuid: string) => Promise<string>) => void;

//   // Use this method to set user Datas after Successful Backend Api
//   setUserData: (user: User) => void;
// }
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
// NON VA => usare reducer
//  https://kentcdodds.com/blog/how-to-use-react-context-effectively

function App() {
  const [loading, setloading] = React.useState(true);

  React.useEffect(() => {
    loadInitialData();
    return () => {
      // component will unmount
    };
  }, []);

  const loadInitialData = async () => {
    // Load cached datas if UUID exist ok otherwhise generate a new one
    // this method is responsible to identify user and assign him a token to make requests
    await AppStore.loadInitialData();
    setloading(false);
  };

  if (loading)
    return (
      <CircularProgress
        style={{ position: "absolute", top: 200, right: "50%" }}
      />
    );

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
