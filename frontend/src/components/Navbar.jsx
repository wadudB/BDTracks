import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
// import Brightness4Icon from "@mui/icons-material/Brightness4";
// import Brightness7Icon from "@mui/icons-material/Brightness7";

const Navbar = () => {
  // eslint-disable-next-line no-unused-vars
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // Define your custom themes with background colors
  const lightTheme = {
    background: "linear-gradient(to right, #dce0e6, #d6cabe)",
    mx: "auto",
    mt: 2,
    maxWidth: "80%",
    px: 2,
    borderRadius: "8px",
  };

  const darkThemeStyle = {
    background: "linear-gradient(to right, #1E293B, #182034,  #1E293B)",
    mx: "auto",
    mt: 2,
    maxWidth: "85%",
    px: 2,
    borderRadius: "8px",
  };

  // Toggle between dark and light theme
  // const toggleTheme = () => {
  //   setIsDarkTheme(!isDarkTheme);
  // };

  return (
    <div>
      <AppBar position="static" sx={isDarkTheme ? darkThemeStyle : lightTheme}>
        <Toolbar>
          <Typography
            variant="h6"
            component="a"
            href="#"
            className="cursor-pointer py-1.5 text-white"
            sx={{ flex: 1, textAlign: "center" }}
          >
            BDTracks
          </Typography>
          {/* <IconButton color="inherit" onClick={toggleTheme}>
            {isDarkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton> */}
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
