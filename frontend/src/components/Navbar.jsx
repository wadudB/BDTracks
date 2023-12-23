import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";

const Navbar = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const darkThemeStyle = {
    background: "linear-gradient(to right, #1E293B, #182034,  #1E293B)",
    mx: "auto",
    mt: 2,
    maxWidth: isSmallScreen ? "88%" : "85%",
    px: 2,
    borderRadius: "8px",
  };

  const linkStyle = {
    marginRight: "20px",
    textDecoration: "none",
    color: "white",
    fontWeight: "bold",
  };

  const titleStyle = {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    py: 1.5,
  };

  return (
    <div>
      <AppBar position="static" sx={darkThemeStyle}>
        <Toolbar sx={{ justifyContent: "flex-end", position: "relative" }}>
          <Typography variant="h6" component="a" href="/" sx={titleStyle}>
            BDTracks
          </Typography>
          <div>
            <Link to="/" style={linkStyle}>
              Road Accident Dashboard
            </Link>
            <Link to="/commodities" style={linkStyle}>
              Commodities
            </Link>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
