import { useEffect, useState } from "react";
import { CircularProgress, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import {
  Contact,
  ExamplesPage,
  Home,
  NotFound,
  Store,
  StoreCategorized,
  Profile,
  Signup,
  Signin,
} from "pages";
import { TopNavigation } from "navigation";

import { createTheme } from "@mui/material/styles";
import AppStore from "stores/AppStore";
import { useSelector } from "react-redux";
import { userState } from "redux/store";

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
  const [loading, setloading] = useState(true);
  const user = useSelector(userState);

  useEffect(() => {
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
        <SnackbarProvider maxSnack={5}>
          <TopNavigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="store/:category" element={<StoreCategorized />} />
            <Route path="store" element={<Store />} />
            <Route path="contact" element={<Contact />} />
            <Route path="signup" element={<Signup />} />
            <Route path="signin" element={<Signin />} />
            <Route
              path="profile"
              element={user.authenticated ? <Profile /> : <Signup />}
            />
            <Route path="examples" element={<ExamplesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SnackbarProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
