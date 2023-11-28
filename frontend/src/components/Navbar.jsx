import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
// import IconButton from "@mui/material/IconButton";
// import NotificationsIcon from "@mui/icons-material/Notifications";

const Navbar = () => {
  const darkThemeStyle = {
    background: "linear-gradient(to right, #1E293B, #182034,  #1E293B)",
    mx: "auto",
    mt: 2,
    maxWidth: "85%",
    px: 2,
    borderRadius: "8px",
  };

  return (
    <div>
      <AppBar position="static" sx={darkThemeStyle}>
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
          {/* <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton> */}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
