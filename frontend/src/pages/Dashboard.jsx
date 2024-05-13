import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Select, MenuItem, CircularProgress } from "@mui/material";
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
  const [viewMode, setViewMode] = useState("monthly");
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
  const [accidentsByDistrict, setAccidentsByDistrict] = useState({});
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all accident summary data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/data`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      setAccidentdata(jsonData);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Latest Accident Data
  const fetchLatestAccidentData = async () => {
    try {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/get_accident_reports`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      setLatestAccidentData(jsonData);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLatestAccidentData();
    const geojsonURL = "/districts.json";
    fetch(geojsonURL)
      .then((response) => response.json())
      .then((data) => {
        setGeojsonData(data[0].data);
      });
  }, []);

  useEffect(() => {
    // Filter the data for the selected year
    const selectedYearData = accidentData.find(
      (item) => item.year === selectedYear
    );
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
      const parsedAccidentsByDistrict = JSON.parse(
        selectedYearData.accidents_by_district
      );

      // District names to lowercase for case-insensitive comparison
      const lowercaseAccidentsByDistrict = Object.keys(
        parsedAccidentsByDistrict
      ).reduce((acc, current) => {
        const lowercaseKey = current.toLowerCase();
        acc[lowercaseKey] = parsedAccidentsByDistrict[current];
        return acc;
      }, {});

      setAccidentsByDistrict(lowercaseAccidentsByDistrict);
    }
  }, [accidentData, selectedYear]);

  const calculateRadius = (accidentCount) => {
    const baseRadius = 15;
    return (Math.sqrt(accidentCount) * baseRadius) / 1.8;
  };

  // Extract unique years
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
    // const selectedYearData = accidentData.find((item) => item.year === newYear);

    // if (selectedYearData) {
    //   // console.log("Selected year", selectedYearData);
    //   setTotalAccidents(selectedYearData.total_accidents);
    //   setTotalDeaths(selectedYearData.total_killed);
    //   setTotalInjured(selectedYearData.total_injured);
    //   setHighestAccidentLocation(selectedYearData.accident_hotspot);
    //   setDailyDeaths(JSON.parse(selectedYearData.daily_deaths));
    //   setDailyInjured(JSON.parse(selectedYearData.daily_injured));
    //   setMonthlyDeaths(JSON.parse(selectedYearData.monthly_deaths));
    //   setMonthlyInjured(JSON.parse(selectedYearData.monthly_injured));
    //   setVehiclesInvolved(JSON.parse(selectedYearData.vehicles_involved));
    //   setAccidentsByDistrict(
    //     JSON.parse(selectedYearData.accidents_by_district)
    //   );
    // }
  };

  const handleViewModeChange = (event, nextView) => {
    if (nextView !== null) {
      setViewMode(nextView);
    }
  };
  // Conditional Rendering
  if (error)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="85vh"
      >
        <p>Error loading data!</p>
      </Box>
    );
  return (
    <Box
      className="container mx-auto pt-7 "
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
            color: theme.palette.text.primary,
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
              color: theme.palette.text.primary,
              textAlign: "right",
              borderColor: "white",
              borderWidth: 0.1,
              fontSize: {
                xs: "0.875rem",
                sm: "1rem",
              },
              backgroundColor: "#061434",
              borderStyle: "solid",
              "& .MuiSelect-select": {
                // Select input
                padding: "6px",
              },
              "& .MuiSvgIcon-root": {
                // Dopdown icon
                color: theme.palette.text.primary,
                fontSize: "1.25rem",
              },
              "&:hover": {
                color: theme.palette.text.highlight,
              },
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: "#061434",
                  color: theme.palette.text.primary,
                },
              },
              sx: {
                ".MuiMenuItem-root": {
                  justifyContent: "center",
                  "&:hover": {
                    color: theme.palette.text.highlight,
                  },
                },
              },
            }}
          >
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
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="85vh"
        >
          <CircularProgress />
        </Box>
      ) : (
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
                title="Accident Hotspot"
                statistic={highestAccidentLocation}
                // statisticNote="+20% Since last week"
              />
            </Grid2>
          </Grid2>
          <Grid2 xs={12} md={7}>
            <DashboardPaper>
              <Typography variant="subtitle2" className="!mb-4 !text-lg">
                Daily Casualties (Last 30 days)
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
                          color: theme.palette.text.primary,
                          backgroundColor: "rgba(255,255,255,0.2)",
                          "&.Mui-selected, &.Mui-selected:hover": {
                            color: theme.palette.text.primary,
                            borderColor: "white",
                          },
                          "&:hover": {
                            color: theme.palette.text.highlight,
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
            <Grid2 xs={12} md={7.5}>
              <DashboardPaper>
                <Typography variant="subtitle2" className="!mb-4 !text-lg">
                  Map View
                </Typography>
                <MapContainer
                  attributionControl={false}
                  center={[23.685, 90.3563]}
                  zoom={7}
                  style={{
                    height: "600px",
                    width: "100%",
                    borderRadius: "8px",
                  }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {geojsonData &&
                    geojsonData.map((district) => {
                      const accidentCount =
                        accidentsByDistrict[district.name.toLowerCase()] || 0;
                      const radius = calculateRadius(accidentCount);
                      return (
                        <CircleMarker
                          key={district.id}
                          center={[
                            parseFloat(district.lat),
                            parseFloat(district.lon),
                          ]}
                          radius={radius}
                          fillColor="red"
                          color="black"
                          weight={2}
                          opacity={0.6}
                          fillOpacity={0.5}
                        >
                          <Tooltip
                            direction="right"
                            offset={[0, 0]}
                            opacity={1}
                            permanent={false}
                          >
                            {`${district.name}: ${accidentCount} accidents`}
                          </Tooltip>
                        </CircleMarker>
                      );
                    })}
                </MapContainer>
              </DashboardPaper>
            </Grid2>
            <Grid2 xs={12} md={4.5}>
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
      )}
    </Box>
  );
};

export default Dashboard;
