import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import "leaflet/dist/leaflet.css";
import {
  Typography,
  Box,
  Unstable_Grid2 as Grid2,
  Divider,
} from "@mui/material";
// import Chart from "../components/Chart";
// import LineChart from "../components/LineChart";
// import VehicleInvolvedChart from "../components/VehicleInvolvedChart";
// import LatestAccidents from "../components/LatestAccidents";
// import DashboardPaper from "../components/DashboardPaper"; // Import the new component

const Chart = React.lazy(() => import("../components/Chart"));
const LineChart = React.lazy(() => import("../components/LineChart"));
const VehicleInvolvedChart = React.lazy(() =>
  import("../components/VehicleInvolvedChart")
);
const LatestAccidents = React.lazy(() =>
  import("../components/LatestAccidents")
);
const DashboardPaper = React.lazy(() => import("../components/DashboardPaper"));

const Dashboard = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [accidentData, setAccidentdata] = useState([]);
  const [viewMode, setViewMode] = useState("monthly"); // 'monthly' or 'yearly'
  const [totalAccidents, setTotalAccidents] = useState(0);
  const [totalDeaths, setTotalDeaths] = useState(0);
  const [totalInjured, setTotalInjured] = useState(0);
  const [highestAccidentLocation, setHighestAccidentLocation] = useState("");

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
    fetchData();
    const geojsonURL = "/bangladesh_geojson_adm2_64_districts_zillas.json";
    fetch(geojsonURL)
      .then((response) => response.json())
      .then((data) => setGeojsonData(data));
  }, []);

  // New useEffect hook to calculate totals whenever accidentData changes
  useEffect(() => {
    let accidents = 0;
    let deaths = 0;
    let injured = 0;

    accidentData.forEach((accident) => {
      console.log("Accident", accident);
      accidents += 1; // Assuming each item in the array is an accident
      deaths += parseInt(accident.total_number_of_people_killed) || 0;
      injured += parseInt(accident.total_number_of_people_injured) || 0;
    });

    setTotalAccidents(accidents);
    setTotalDeaths(deaths);
    setTotalInjured(injured);
  }, [accidentData]);

  const handleViewModeChange = (event, nextView) => {
    if (nextView !== null) {
      setViewMode(nextView);
    }
  };

  // New useEffect hook to calculate totals and highest accident location
  useEffect(() => {
    const locationFrequency = accidentData.reduce(
      (acc, { district_of_accident }) => {
        if (district_of_accident) {
          acc[district_of_accident] = (acc[district_of_accident] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    const highestFrequencyLocation = Object.entries(locationFrequency).sort(
      (a, b) => b[1] - a[1]
    )[0];

    setHighestAccidentLocation(
      highestFrequencyLocation ? highestFrequencyLocation[0] : "Not available"
    );
  }, [accidentData]);

  return (
    <Box className="container mx-auto pt-7 mb-5" style={{ maxWidth: "85%" }}>
      <Typography
        variant="h4"
        className="mb-4"
        sx={{
          fontSize: {
            xs: "1.88rem", // Smaller font size on extra-small devices
            sm: "1.88rem", // Slightly larger font size on small devices
            md: "2.125rem", // Default h4 size on medium devices and larger
          },
        }}
      >
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
              statistic={totalAccidents.toLocaleString()}
              // statisticNote="+14% Since last week"
            />
          </Grid2>
          <Grid2 xs={6} md={12} lg={6}>
            <DashboardPaper
              title="Total Deaths"
              statistic={totalDeaths.toLocaleString()}
              // statisticNote="+8% Since last week"
            />
          </Grid2>
          <Grid2 xs={6} md={12} lg={6}>
            <DashboardPaper
              title="Total Injured"
              statistic={totalInjured.toLocaleString()}
              // statisticNote="+5% Since last week"
            />
          </Grid2>
          <Grid2 xs={6} md={12} lg={6}>
            <DashboardPaper
              title="Highest accident location"
              statistic={highestAccidentLocation}
              // statisticNote="+20% Since last week"
            />
          </Grid2>
        </Grid2>
        <Grid2 xs={12} md={7}>
          <DashboardPaper>
            <Typography variant="subtitle2" className="!mb-4 !text-lg">
              Daily Deaths
            </Typography>
            <LineChart accidentData={accidentData} />
          </DashboardPaper>
        </Grid2>
        <Grid2 xs={12} container spacing={2}>
          <Grid2 xs={12} md={12}>
            <DashboardPaper>
              <Grid2
                container
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Grid2 item>
                  <Typography variant="subtitle2" className="!mb-4 !text-lg">
                    Death / Injured
                  </Typography>
                </Grid2>
                <Grid2 item>
                  <ToggleButtonGroup
                    size="small"
                    color="primary"
                    value={viewMode}
                    exclusive
                    onChange={handleViewModeChange}
                    sx={{
                      "& .MuiToggleButtonGroup-grouped": {
                        color: "white",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        "&.Mui-selected, &.Mui-selected:hover": {
                          color: "white",
                          borderColor: "white",
                        },
                        "&:hover": {
                          color: "white",
                          borderColor: "white",
                        },
                      },
                    }}
                  >
                    <ToggleButton value="monthly">Monthly</ToggleButton>
                    <ToggleButton value="yearly">Yearly</ToggleButton>
                  </ToggleButtonGroup>
                </Grid2>
              </Grid2>
              <Chart accidentData={accidentData} viewMode={viewMode} />
            </DashboardPaper>
          </Grid2>
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
                Vehicles Involved
              </Typography>
              <VehicleInvolvedChart accidentData={accidentData} />
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
