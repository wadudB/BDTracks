import React from "react";
import { useState, useEffect } from "react";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import "leaflet/dist/leaflet.css";
import {
  Typography,
  Box,
  Unstable_Grid2 as Grid2,
  Divider,
  CircularProgress,
} from "@mui/material";

const DashboardPaper = React.lazy(() => import("../components/DashboardPaper"));
const CommodityPriceTracker = React.lazy(() =>
  import("../components/CommodityPriceTracker")
);

const Commodities = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [commodityData, setCommodityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Asynchronous function to fetch commodity data
    const fetchCommodityData = async () => {
      try {
        const response = await fetch("http://localhost:5000/commodity-data");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCommodityData(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchCommodityData();
  }, []);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  if (error) return <p>Error loading data!</p>;

  return (
    <Box
      className="container mx-auto pt-7 mb-5"
      style={{ maxWidth: isSmallScreen ? "88%" : "85%" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "right",
        }}
      >
        <Typography
          variant="h4"
          className="mb-4"
          sx={{
            fontSize: {
              xs: "1.88rem",
              sm: "1.88rem",
              md: "2.125rem",
            },
          }}
        >
          Commodity Price Tracker
        </Typography>
      </div>
      <div className="my-5">
        <Divider variant="fullwidth" sx={{ borderColor: "#ffffff" }} />
      </div>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} container spacing={2}>
          <Grid2 xs={12} md={12}>
            <DashboardPaper>
              <CommodityPriceTracker commodityData={commodityData} />
            </DashboardPaper>
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Commodities;
