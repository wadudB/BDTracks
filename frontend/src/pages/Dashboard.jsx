// Dashboard.js
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  Typography,
  Box,
  Unstable_Grid2 as Grid2,
  Divider,
} from "@mui/material";
import Chart from "../components/Chart";
import SourceMediumChart from "../components/SourceMediumChart";
import LatestAccidents from "../components/LatestAccidents";
import DashboardPaper from "../components/DashboardPaper"; // Import the new component

const Dashboard = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [accidentData, setAccidentdata] = useState([]);

  // Function to fetch data from Flask API
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/data");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      setAccidentdata(jsonData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    const geojsonURL = "/bangladesh_geojson_adm2_64_districts_zillas.json";
    fetch(geojsonURL)
      .then((response) => response.json())
      .then((data) => setGeojsonData(data));
  }, []);

  // useEffect to call fetchData on component mount
  useEffect(() => {
    fetchData();
  }, []); // The empty array ensures this effect runs once on mount
  console.log("Fetching data", accidentData);
  return (
    <Box className="container mx-auto pt-7 mb-5" style={{ maxWidth: "85%" }}>
      <Typography variant="h4" className="mb-4">
        Road Accident Dashboard
      </Typography>
      <div className="my-5">
        <Divider variant="fullwidth" sx={{ borderColor: "#ffffff" }} />
      </div>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} md={5} container spacing={2}>
          <Grid2 xs={6} md={12} lg={6}>
            <DashboardPaper
              title="Total Accident"
              statistic="24,532"
              statisticNote="+14% Since last week"
            />
          </Grid2>
          <Grid2 xs={6} md={12} lg={6}>
            <DashboardPaper
              title="Injured"
              statistic="18,245"
              statisticNote="+8% Since last week"
            />
          </Grid2>
          <Grid2 xs={6} md={12} lg={6}>
            <DashboardPaper
              title="Fatal"
              statistic="1,134"
              statisticNote="+5% Since last week"
            />
          </Grid2>
          <Grid2 xs={6} md={12} lg={6}>
            <DashboardPaper
              title="Visitors"
              statistic="9,842"
              statisticNote="+20% Since last week"
            />
          </Grid2>
        </Grid2>
        <Grid2 xs={12} md={7}>
          <DashboardPaper>
            <Typography variant="subtitle2" className="!mb-4 !text-lg">
              Death / Injured
            </Typography>
            <Chart />
          </DashboardPaper>
        </Grid2>
        <Grid2 xs={12} container spacing={2}>
          <Grid2 xs={12} md={8}>
            <DashboardPaper>
              <Typography variant="subtitle2" className="!mb-4 !text-lg">
                Real-Time
              </Typography>
              <MapContainer
                center={[23.685, 90.3563]}
                zoom={7}
                style={{ height: "400px", width: "100%", borderRadius: "8px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {geojsonData && <GeoJSON data={geojsonData} />}
              </MapContainer>
            </DashboardPaper>
          </Grid2>
          <Grid2 xs={12} md={4}>
            <DashboardPaper>
              <Typography variant="subtitle2" className="!mb-4 !text-lg">
                Source / Medium
              </Typography>
              <SourceMediumChart />
            </DashboardPaper>
          </Grid2>
        </Grid2>
        <Grid2 xs={12} container spacing={2}>
          <Grid2 xs={12} md={12}>
            <DashboardPaper>
              <Typography variant="subtitle2" className="!text-lg">
                Recent Accident Reports
              </Typography>
              <LatestAccidents accidentData={accidentData} />
            </DashboardPaper>
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Dashboard;
