import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useState } from "react";
import { styled } from "@mui/material/styles";

const Navbar = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallOrMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const darkThemeStyle = {
    background: "linear-gradient(to right, #1E293B, #182034,  #1E293B)",
    mx: "auto",
    mt: 2,
    maxWidth: isSmallScreen ? "88%" : "85%",
    borderRadius: "8px",
  };

  const drawerStyle = {
    ".MuiDrawer-paper": {
      backgroundColor: "#123456",
      color: "white",
      paddingTop: "20px",
    },
  };

  const StyledLink = styled(Link)({
    marginRight: "20px",
    textDecoration: "none",
    color: "white",
    "&:hover": {
      color: "#c77676",
    },
  });

  const titleStyle = {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    color: "white",
    textDecoration: "none",
    py: 1.5,
  };

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {["Road Accident Dashboard", "Commodities"].map((text, index) => (
          <ListItem button key={text}>
            <StyledLink to={index % 2 === 0 ? "/" : "/commodities"}>
              {text}
            </StyledLink>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <AppBar position="static" sx={darkThemeStyle}>
        <Toolbar sx={{ justifyContent: "flex-end", position: "relative" }}>
          <Typography variant="h6" component="a" href="/" sx={titleStyle}>
            BDTracks
          </Typography>
          {isSmallOrMediumScreen ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <div>
              <StyledLink to="/">Road Accident Dashboard</StyledLink>
              <StyledLink to="/commodities">Commodities</StyledLink>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={drawerStyle}
      >
        {list()}
      </Drawer>
    </div>
  );
};

export default Navbar;
