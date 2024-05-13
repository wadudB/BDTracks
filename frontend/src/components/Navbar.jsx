import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

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
    backgroundColor: "#061434",
    mx: "auto",
    mt: 2,
    maxWidth: isSmallScreen ? "92%" : "85%",
    borderRadius: "8px",
  };

  const drawerStyle = {
    ".MuiDrawer-paper": {
      backgroundColor: "#060522",
      color: theme.palette.text.primary,
      paddingTop: "20px",
    },
  };

  // eslint-disable-next-line no-unused-vars
  const StyledLink = styled(RouterLink)(({ theme }) => ({
    textDecoration: "none",
    color: theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.text.highlight,
    },
  }));

  const titleStyle = {
    position: "absolute",
    left: "0",
    // transform: "translateX(-50%)",
    color: theme.palette.text.primary,
    textDecoration: "none",
    py: 1.5,
    "&:hover": {
      color: theme.palette.text.highlight,
    },
  };

  const menuItems = [
    { text: "Road Accident Dashboard", path: "/road-accident-dashboard" },
    { text: "Election Survey", path: "/election-survey" },
    // { text: "Commodities", path: "/commodities" },
  ];

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text}>
            <StyledLink to={item.path}>
              <Typography variant="body1">{item.text}</Typography>
            </StyledLink>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <AppBar position="static" sx={darkThemeStyle}>
        <Toolbar
          sx={{
            justifyContent: "flex-end",
            position: "relative",
            marginLeft: "20px",
          }}
        >
          <Typography variant="h5" component="a" href="/" sx={titleStyle}>
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
            menuItems.map((item, index) => (
              <StyledLink key={item.text} to={item.path}>
                <Typography
                  variant="body2"
                  sx={{
                    display: "inline",
                    // Right margin except for the last item
                    marginRight: index !== menuItems.length - 1 ? "20px" : "0",
                  }}
                >
                  {item.text}
                </Typography>
              </StyledLink>
            ))
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
