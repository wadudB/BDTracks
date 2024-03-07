import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box className="text-white p-4 flex items-center justify-center">
      <Typography variant="body2" className="flex items-center" color="#CBD5E1">
        &copy; {new Date().getFullYear()}, BDTracks
      </Typography>
    </Box>
  );
};

export default Footer;
