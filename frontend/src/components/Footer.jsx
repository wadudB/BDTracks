import { Box, Typography, IconButton, Link, Divider } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import FacebookIcon from "@mui/icons-material/Facebook";

const Footer = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ mx: "auto", maxWidth: isSmallScreen ? "92%" : "85%", mt: 2 }}>
      <Divider sx={{ borderColor: theme.palette.text.primary }} />
      <Box
        sx={{
          mx: "auto",
          color: theme.palette.text.primary,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // justifyContent: "space-between",
        }}
      >
        <IconButton
          aria-label="facebook"
          disableRipple
          sx={{ color: theme.palette.text.primary, p: 0 }}
        >
          <Link
            href="https://www.facebook.com/profile.php?id=61555334998986"
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            sx={{
              color: "inherit",
              "&:hover": { color: theme.palette.text.highlight },
            }}
          >
            <FacebookIcon />
          </Link>
        </IconButton>
        <Typography variant="body2" sx={{ p: 0.5 }}>
          &copy; {new Date().getFullYear()}, BDTracks
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
