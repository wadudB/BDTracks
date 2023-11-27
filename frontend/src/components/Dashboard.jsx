import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import LatestAccidents from "./LatestAccidents";
import "leaflet/dist/leaflet.css";
import {
  Typography,
  Paper,
  Box,
  Unstable_Grid2 as Grid2,
  Divider,
} from "@mui/material";
import Chart from "./Chart";
import SourceMediumChart from "./SourceMediumChart";

const Dashboard = () => {
  const [geojsonData, setGeojsonData] = useState(null);

  useEffect(() => {
    // Replace with your URL for fetching the GeoJSON data
    const geojsonURL = "/bangladesh_geojson_adm2_64_districts_zillas.json";

    fetch(geojsonURL)
      .then((response) => response.json())
      .then((data) => setGeojsonData(data));
  }, []);
  return (
    <Box className="container mx-auto pt-7">
      <Typography variant="h4" className="mb-4">
        Road accident Dashboard
      </Typography>
      <div className="my-5">
        <Divider variant="middle" sx={{ borderColor: "#ffffff" }} />
      </div>
      {/* Grid container */}
      <Grid2 container spacing={2}>
        {/* Metric cards container */}
        <Grid2 xs={12} md={5} container spacing={2}>
          {/* First row of metric cards */}
          <Grid2 xs={6} md={12} lg={6}>
            <Paper
              className="p-4 flex flex-col justify-between h-full"
              style={{ backgroundColor: "#202940", borderRadius: "8px" }}
            >
              <Box>
                <Typography variant="subtitle2">Total accident</Typography>
                <Typography variant="h5" className="font-bold">
                  24,532
                </Typography>
                <Typography variant="body2" className="text-green-500">
                  +14% Since last week
                </Typography>
              </Box>
            </Paper>
          </Grid2>
          <Grid2 xs={6} md={12} lg={6}>
            <Paper
              className="p-4 flex flex-col justify-between h-full"
              style={{ backgroundColor: "#202940", borderRadius: "8px" }}
            >
              <Box>
                <Typography variant="subtitle2">Injured</Typography>
                <Typography variant="h5" className="font-bold">
                  24,532
                </Typography>
                <Typography variant="body2" className="text-green-500">
                  +14% Since last week
                </Typography>
              </Box>
            </Paper>
          </Grid2>
          {/* Second row of metric cards */}
          <Grid2 xs={6} md={12} lg={6}>
            <Paper
              className="p-4 flex flex-col justify-between h-full"
              style={{ backgroundColor: "#202940", borderRadius: "8px" }}
            >
              <Box>
                <Typography variant="subtitle2">Fatal</Typography>
                <Typography variant="h5" className="font-bold">
                  24,532
                </Typography>
                <Typography variant="body2" className="text-green-500">
                  +14% Since last week
                </Typography>
              </Box>
            </Paper>
          </Grid2>
          <Grid2 xs={6} md={12} lg={6}>
            <Paper
              className="p-4 flex flex-col justify-between h-full"
              style={{ backgroundColor: "#202940", borderRadius: "8px" }}
            >
              <Box>
                <Typography variant="subtitle2">Visitors</Typography>
                <Typography variant="h5" className="font-bold">
                  24,532
                </Typography>
                <Typography variant="body2" className="text-green-500">
                  +14% Since last week
                </Typography>
              </Box>
            </Paper>
          </Grid2>
        </Grid2>

        {/* Chart section */}
        <Grid2 xs={12} md={7}>
          <Paper
            className="p-4 h-full"
            style={{ backgroundColor: "#202940", borderRadius: "8px" }}
          >
            <Typography variant="subtitle2" className="mb-4">
              Death / Injured
            </Typography>
            <Chart />
          </Paper>
        </Grid2>
      </Grid2>
      <Box className="pt-7">
        <Grid2 container spacing={2}>
          <Grid2 xs={12} md={8}>
            <Paper
              className="p-4 h-full bg-dashboard-dark"
              style={{ backgroundColor: "#202940", borderRadius: "8px" }}
            >
              <Typography variant="subtitle2" className="mb-4">
                Real-Time
              </Typography>
              <MapContainer
                center={[23.685, 90.3563]}
                zoom={7}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {geojsonData && (
                  <GeoJSON
                    data={geojsonData}
                    // style={style}
                    // onEachFeature={onEachFeature}
                  />
                )}
              </MapContainer>
            </Paper>
          </Grid2>
          {/* {/* Source / Medium Section */}
          <Grid2 xs={12} md={4}>
            <Paper
              className="p-4 flex flex-col justify-between h-full"
              style={{ backgroundColor: "#202940", borderRadius: "8px" }}
            >
              <Typography variant="subtitle2" className="mb-4">
                Source / Medium
              </Typography>
              <SourceMediumChart />
            </Paper>
          </Grid2>
        </Grid2>
      </Box>
      <Box className="pt-7">
        <Grid2 container spacing={2}>
          <Grid2
            xs={12}
            md={12}
            style={{ backgroundColor: "#202940", borderRadius: "8px" }}
          >
            <LatestAccidents />
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default Dashboard;
