import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router";
import store, { userState } from "redux/store";
import { useSelector } from "react-redux";
import { Icon, PaletteMode } from "@mui/material";
import SvgIcons from "assets/svg/SvgIcons";
import AppStore from "stores/AppStore";

let pages = [{ title: "Restaurants", url: "/restaurants" }];

if (AppStore.user?.userType === "user") {
  pages = [{ title: "Restaurants", url: "/restaurants" }];
}

if (AppStore.user?.userType === "chef") {
}

if (AppStore.user?.userType === "waiter") {
}

if (AppStore.user?.userType === "admin") {
}

if (AppStore.user?.userType === "super-admin") {
  pages = [
    { title: "Restaurants", url: "/restaurants" },
    { title: "Users", url: "/users" },
    { title: "Recipes", url: "/recipes" },
    { title: "Simulator", url: "/simulator" },
  ];
}

interface Setting {
  title: string;
  url?: string;
  onclick?: () => void;
}

interface TopNavigationProps {
  toggleColorMode: () => void;
  colorMode: "light" | "dark";
}

const TopNavigation = ({ toggleColorMode, colorMode }: TopNavigationProps) => {
  const user = useSelector(userState);

  const logout = () => {
    store.dispatch({
      type: "user/logout",
      payload: undefined,
    });
    return;
  };

  const settings = [
    { title: "Profile", url: "/profile" },
    { title: "Dashboard", url: "/" },
    { title: "Logout", onclick: logout },
  ];

  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const navigateToSetting = (setting: Setting) => {
    handleCloseUserMenu();
    if (setting.url) return navigate(setting.url);
    setting.onclick && setting.onclick();
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onMenuOptionClick = (url: string) => {
    handleCloseNavMenu();
    navigate(url);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters variant="regular">
          <Typography
            className="clickable"
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            onClick={() => navigate("/")}
          >
            Home
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.title}
                  onClick={() => onMenuOptionClick(page.url)}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            onClick={() => navigate("/")}
          >
            React Boilerplate
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                onClick={() => onMenuOptionClick(page.url)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Box>
              {user.authenticated && (
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp">
                      {user.user?.name.charAt(0) ??
                        "" + user.user?.surname.charAt(0) ??
                        ""}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              )}

              {!user.authenticated && (
                <Button
                  onClick={() => navigate("/signin")}
                  sx={{ my: 2, color: "white" }}
                >
                  Accedi
                </Button>
              )}

              <Tooltip title="Toogle Color Mode">
                <IconButton
                  onClick={toggleColorMode}
                  sx={{ p: 0 }}
                  style={{ marginLeft: 10, marginTop: 6 }}
                >
                  <SvgIcons
                    icon={colorMode === "light" ? "DarkMode" : "LightMode"}
                  />
                </IconButton>
              </Tooltip>
            </Box>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.title}
                  onClick={() => navigateToSetting(setting)}
                >
                  <Typography textAlign="center">{setting.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default TopNavigation;
