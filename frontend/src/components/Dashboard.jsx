import {
  Typography,
  Paper,
  Box,
  Unstable_Grid2 as Grid2,
  Divider,
} from "@mui/material";
// import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import Chart from "./Chart";
import SourceMediumChart from "./SourceMediumChart";

const Dashboard = () => {
  //   const geoUrl = "/small_bangladesh_geojson_adm0_whole_bangladesh_outline.json";
  //   console.log(geoUrl);
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
            <Paper className="p-4 flex flex-col justify-between h-full">
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
            <Paper className="p-4 flex flex-col justify-between h-full">
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
            <Paper className="p-4 flex flex-col justify-between h-full">
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
            <Paper className="p-4 flex flex-col justify-between h-full">
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
          <Paper className="p-4 h-full">
            <Typography variant="subtitle2" className="mb-4">
              Death / Injured
            </Typography>
            <Chart />
          </Paper>
        </Grid2>
      </Grid2>
      <Box className="pt-7">
        <Grid2 container spacing={2}>
          {/* <Grid2 xs={12} md={6}>
            <Paper className="p-4 h-full">
              <Typography variant="subtitle2" className="mb-4">
                Real-Time
              </Typography>
              <ComposableMap
                projection="geoAzimuthalEqualArea"
                projectionConfig={{ scale: 4000 }}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography key={geo.rsmKey} geography={geo} />
                    ))
                  }
                </Geographies>
              </ComposableMap>
            </Paper>
          </Grid2> */}
          {/* Source / Medium Section */}
          <Grid2 xs={12} md={6}>
            <Paper className="p-4 h-full">
              <Typography variant="subtitle2" className="mb-4">
                Source / Medium
              </Typography>
              <SourceMediumChart />
            </Paper>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default Dashboard;
