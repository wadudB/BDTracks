import { Box, Grid, Typography, useTheme } from "@mui/material";
import PropTypes from "prop-types";
const AboutUs = ({ imageSrc, description }) => {
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1, padding: theme.spacing(3) }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={imageSrc}
            alt="About Us"
            sx={{
              width: "100%",
              height: "auto",
              maxWidth: "400px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography
            variant="body1"
            sx={{ color: "#CBD5E1" }}
            textAlign="justify"
          >
            {description}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
AboutUs.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
export default AboutUs;
