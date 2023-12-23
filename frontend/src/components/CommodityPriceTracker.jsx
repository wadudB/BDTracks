import { Container, Typography, Box, Paper, Grid } from "@mui/material";
import PropTypes from "prop-types";

function CommodityPriceTracker({ commodityData }) {
  return (
    <Container>
      <Box my={4}>
        {commodityData.map((commodity, index) => (
          <Paper
            elevation={3}
            style={{ padding: "20px", marginBottom: "10px" }}
            key={index}
          >
            <Grid container spacing={2}>
              {/* <Grid item xs={12} md={4}>
                <Typography variant="body1">
                  Commodity ID: <span>{commodity.id}</span>
                </Typography>
              </Grid> */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  Commodity Name: <span>{commodity.name}</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  Commodity Price: <span>{commodity.price}</span>
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
    </Container>
  );
}
CommodityPriceTracker.propTypes = {
  commodityData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      price: PropTypes.string,
    })
  ).isRequired,
};
export default CommodityPriceTracker;
