import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Select, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import "leaflet/dist/leaflet.css";
import {
  Typography,
  Box,
  Unstable_Grid2 as Grid2,
  Divider,
} from "@mui/material";

const Chart = React.lazy(() => import("../components/Chart"));
const LineChart = React.lazy(() => import("../components/LineChart"));
const DashboardPaper = React.lazy(() => import("../components/DashboardPaper"));
const VehicleInvolvedChart = React.lazy(() =>
  import("../components/VehicleInvolvedChart")
);
const LatestAccidents = React.lazy(() =>
  import("../components/LatestAccidents")
);

const Dashboard = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [accidentData, setAccidentdata] = useState([]);
  const [latestAccidentData, setLatestAccidentData] = useState([]);
  const [viewMode, setViewMode] = useState("monthly"); // 'monthly' or 'yearly'
  const [totalAccidents, setTotalAccidents] = useState(0);
  const [totalDeaths, setTotalDeaths] = useState(0);
  const [totalInjured, setTotalInjured] = useState(0);
  const [highestAccidentLocation, setHighestAccidentLocation] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dailyDeaths, setDailyDeaths] = useState({});
  const [dailyInjured, setDailyInjured] = useState({});
  const [monthlyDeaths, setMonthlyDeaths] = useState({});
  const [monthlyInjured, setMonthlyInjured] = useState({});
  const [vehiclesInvolved, setVehiclesInvolved] = useState({});
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  // Function to fetch data from Flask API
  const fetchData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/data`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      setAccidentdata(jsonData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Function to fetch data from Flask API
  const fetchLatestAccidentData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/get_accident_reports`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      setLatestAccidentData(jsonData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLatestAccidentData();
    const geojsonURL = "/bangladesh_geojson_adm2_64_districts_zillas.json";
    fetch(geojsonURL)
      .then((response) => response.json())
      .then((data) => setGeojsonData(data));
  }, []);

  useEffect(() => {
    // Filter the data for the selected year
    const selectedYearData = accidentData.find(
      (item) => item.year === selectedYear
    );
    // console.log(accidentData);
    if (selectedYearData) {
      // console.log("Selected year: ", selectedYearData);
      // Extract total deaths and total injuries from the selected year data
      setTotalAccidents(selectedYearData.total_accidents);
      setTotalDeaths(selectedYearData.total_killed);
      setTotalInjured(selectedYearData.total_injured);
      setHighestAccidentLocation(selectedYearData.accident_hotspot);
      setDailyDeaths(JSON.parse(selectedYearData.daily_deaths));
      setDailyInjured(JSON.parse(selectedYearData.daily_injured));
      setMonthlyDeaths(JSON.parse(selectedYearData.monthly_deaths));
      setMonthlyInjured(JSON.parse(selectedYearData.monthly_injured));
      setVehiclesInvolved(JSON.parse(selectedYearData.vehicles_involved));
    }
  }, [accidentData, selectedYear]);

  // Function to extract unique years from the response
  const getUniqueYears = () => {
    const years = new Set();
    accidentData.forEach((item) => {
      years.add(item.year);
    });
    return Array.from(years);
  };

  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setSelectedYear(newYear);

    // Filter the data for the selected year
    const selectedYearData = accidentData.find((item) => item.year === newYear);

    if (selectedYearData) {
      // console.log("Selected year", selectedYearData);
      setTotalAccidents(selectedYearData.total_accidents);
      setTotalDeaths(selectedYearData.total_killed);
      setTotalInjured(selectedYearData.total_injured);
      setHighestAccidentLocation(selectedYearData.accident_hotspot);
      setDailyDeaths(JSON.parse(selectedYearData.daily_deaths));
      setDailyInjured(JSON.parse(selectedYearData.daily_injured));
      setMonthlyDeaths(JSON.parse(selectedYearData.monthly_deaths));
      setMonthlyInjured(JSON.parse(selectedYearData.monthly_injured));
      setVehiclesInvolved(JSON.parse(selectedYearData.vehicles_involved));
    }
  };

  const handleViewModeChange = (event, nextView) => {
    if (nextView !== null) {
      setViewMode(nextView);
    }
  };

  return (
    <Box
      className="container mx-auto pt-7 mb-5"
      style={{ maxWidth: isSmallScreen ? "92%" : "85%" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
          Road Accident Dashboard
        </Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            sx={{
              marginLeft: 2,
              width: 100,
              color: "white",
              textAlign: "right",
              borderColor: "white",
              borderWidth: 0.1,
              fontSize: {
                xs: "0.875rem", // smaller font size on extra-small screens
                sm: "1rem", // default font size on small screens and up
              },
              backgroundColor: "#202940",
              borderStyle: "solid",
              "& .MuiSelect-select": {
                // Style for the select input
                padding: "6px",
              },
              "& .MuiSvgIcon-root": {
                // Style for the dropdown icon
                color: "white",
                fontSize: "1.25rem",
              },
              "&:hover": {
                color: "#c77676",
              },
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: "#202940",
                  color: "white",
                },
              },
              sx: {
                ".MuiMenuItem-root": {
                  justifyContent: "center",
                  "&:hover": {
                    color: "#c77676",
                  },
                },
              },
            }}
          >
            {/* Menu items */}
            {getUniqueYears().map((year) => (
              <MenuItem
                key={year}
                value={year}
                style={{ justifyContent: "center" }}
              >
                {year}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="my-5">
        <Divider variant="fullwidth" sx={{ borderColor: "#ffffff" }} />
      </div>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} md={5} container spacing={2}>
          <Grid2 xs={6} md={12} lg={6}>
            <DashboardPaper
              title="Total Accidents"
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
            <LineChart
              dailyDeathsData={dailyDeaths}
              dailyInjuredData={dailyInjured}
            />
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
                <Grid2 item="true">
                  <Typography variant="subtitle2" className="!mb-4 !text-lg">
                    Death / Injured
                  </Typography>
                </Grid2>
                <Grid2 item="true">
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
                          color: "#c77676",
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
              <Chart
                monthlyInjured={monthlyInjured}
                monthlyDeaths={monthlyDeaths}
                accidentData={accidentData}
                viewMode={viewMode}
              />
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
              <VehicleInvolvedChart vehiclesInvolved={vehiclesInvolved} />
            </DashboardPaper>
          </Grid2>
        </Grid2>
        <Grid2 xs={12} container spacing={2}>
          <Grid2 xs={12} md={12}>
            <DashboardPaper>
              <Typography variant="subtitle2" className="!text-lg !mb-2">
                Recent Accident Reports
              </Typography>
              <LatestAccidents latestAccidentData={latestAccidentData} />
            </DashboardPaper>
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Dashboard;
