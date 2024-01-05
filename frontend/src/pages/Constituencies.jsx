import {
  Typography,
  Box,
  Modal,
  Divider,
  Unstable_Grid2 as Grid2,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableCell,
} from "@mui/material";
import { styled } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useState, useEffect, useMemo } from "react";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../css/leaflet.css";
import PropTypes from "prop-types";
import { Checkbox, Button } from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Bar } from "react-chartjs-2";
import "leaflet-boundary-canvas";
import MuiToolTip from "@mui/material/Tooltip";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const DashboardPaper = React.lazy(() => import("../components/DashboardPaper"));
const PartyGrid = React.lazy(() => import("../components/PartyGrid"));
const MapLogicComponent = React.lazy(() =>
  import("../components/MapLogicComponent")
);
// const VotePercentageBarChart = React.lazy(() =>
//   import("../components/VotePercentageBarChart")
// );

// const CandidateDetailsTable = React.lazy(() =>
//   import("../components/CandidateDetailsTable")
// );

// Create a custom-styled button
const CustomButton = styled(Button)(() => ({
  // Apply styles when the button is disabled
  "&.Mui-disabled": {
    color: "rgb(255 255 255 / 26%)",
    boxShadow: "none",
    backgroundColor: "rgb(255 255 255 / 12%)",
  },
}));

// Table component for displaying candidate details
const CandidateDetailsTable = ({
  data,
  selectedCandidates,
  setSelectedCandidates,
  onVoteSuccess,
}) => {
  const handleCheck = (candidateName) => {
    setSelectedCandidates((currentSelected) => {
      const newSelected = Object.keys(currentSelected).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      newSelected[candidateName] = true;
      return newSelected;
    });
  };

  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarInfo({ ...snackbarInfo, open: false });
  };

  const handleVote = async (candidateId) => {
    const userAgent = navigator.userAgent;
    const voteData = {
      candidateId,
      userAgent,
    };

    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/submit_vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(voteData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to add Vote");
      }

      setSnackbarInfo({
        open: true,
        message: "Vote added, Thank you for your participation!",
        severity: "success",
      });
      // Call the passed fetchElectionData function to refresh data
      onVoteSuccess();
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: error.message || "Error adding Vote",
        severity: "error",
      });
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 2,
        maxHeight: "440px", // Set a fixed height
        overflow: "auto",
      }}
    >
      <Snackbar
        open={snackbarInfo.open}
        autoHideDuration={7000} // Hide after 7 seconds
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ width: "100%", textAlign: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarInfo.severity}>
          {snackbarInfo.message}
        </Alert>
      </Snackbar>
      <Table
        sx={{
          backgroundColor: "#202940",
          minWidth: 300,
          border: "1px solid white",
        }}
        aria-label="candidate details table"
      >
        <TableHead style={{ backgroundColor: "#141d33" }}>
          <TableRow>
            <TableCell style={{ color: "white" }}>Candidate</TableCell>
            <TableCell style={{ color: "white" }} align="right">
              Party
            </TableCell>
            <TableCell style={{ color: "white" }} align="right">
              Select
            </TableCell>
            <TableCell style={{ color: "white" }} align="right">
              Vote
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row" style={{ color: "white" }}>
                {row.CandidateName}
              </TableCell>
              <TableCell style={{ color: "white" }} align="right">
                <MuiToolTip
                  title={row.PartyName}
                  enterTouchDelay={0}
                  leaveTouchDelay={3000}
                >
                  <span
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    {row.Party}
                  </span>
                </MuiToolTip>
              </TableCell>
              <TableCell style={{ color: "white" }} align="right">
                <Checkbox
                  sx={{ color: "white" }}
                  checked={selectedCandidates[row.CandidateName] || false}
                  onChange={() => handleCheck(row.CandidateName)}
                  disabled={row.CandidateName === "Nomination Withdrawn"}
                />
              </TableCell>
              <TableCell style={{ color: "white" }} align="right">
                <CustomButton
                  variant="contained"
                  color="primary"
                  onClick={() => handleVote(row.CandidateId)}
                  disabled={
                    !selectedCandidates[row.CandidateName] ||
                    row.CandidateName === "Nomination Withdrawn"
                  }
                >
                  Vote
                </CustomButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
CandidateDetailsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      CandidateName: PropTypes.string.isRequired,
      Party: PropTypes.string.isRequired,
      Votes: PropTypes.number,
      // Add other properties as necessary
    })
  ).isRequired,
  selectedCandidates: PropTypes.object.isRequired,
  setSelectedCandidates: PropTypes.func.isRequired,
  onVoteSuccess: PropTypes.func.isRequired,
};

const VotePercentageBarChart = React.memo(({ votePercentages }) => {
  // Calculate the total votes
  const totalVotes = votePercentages.reduce(
    (acc, candidate) => acc + candidate.Votes,
    0
  );

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      datalabels: {
        display: true,
        color: "white",
        anchor: "end",
        align: "start",
        offset: -10,
        formatter: (value, context) => {
          return context.chart.data.labels[context.dataIndex];
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        display: false,
        max: 100,
        ticks: {
          callback: function (value) {
            return `${value}%`;
          },
        },
      },
      y: {
        stacked: true,
        display: false,
      },
    },
  };
  const barTextPlugin = {
    id: "barTextPlugin",
    afterDatasetsDraw(chart) {
      const ctx = chart.ctx;
      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);
        meta.data.forEach((bar) => {
          // Set the text styling
          ctx.fillStyle = "black";
          const fontSize = 14;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = `${fontSize}px Arial`;

          // Retrieve the party name from the dataset
          const partyName = dataset.label;

          // For horizontal centering, use the center of the bar's width
          const xPos = bar.getCenterPoint().x;

          // For vertical centering, use the center of the bar's height
          const yPos = bar.getCenterPoint().y;

          // Draw the text if there's enough room within the bar
          if (bar.width > ctx.measureText(partyName).width) {
            ctx.fillText(partyName, xPos, yPos);
          }
        });
      });
    },
  };

  const datasets = votePercentages.map((item) => ({
    label: item.Party,
    data: [((item.Votes / totalVotes) * 100).toFixed(2)],
    backgroundColor: item.color,
    // party: item.Party,
  }));

  const data = {
    labels: ["Winning Projection"],
    datasets,
  };

  return (
    <Bar options={options} data={data} height="30%" plugins={[barTextPlugin]} />
  );
});

VotePercentageBarChart.displayName = "VotePercentageBarChart";

// prop types validation for votePercentages
VotePercentageBarChart.propTypes = {
  votePercentages: PropTypes.arrayOf(
    PropTypes.shape({
      CandidateName: PropTypes.string.isRequired,
      Votes: PropTypes.number.isRequired,
      Party: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const Constituencies = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [geojsonData, setGeojsonData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(null);
  const [error, setError] = useState(null);
  const [electionData, setElectionData] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [leadingParties, setLeadingParties] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const mapHeight = isSmallScreen ? "60vh" : "130vh";
  const defaultZoom = isSmallScreen ? 7.8 : 8;

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "90%" : 500,
    bgcolor: "#141d33",
    border: "2px solid #000",
    boxShadow: 24,
    p: 2,
    borderRadius: "9px",
    overflowY: "auto",
    maxHeight: "90vh",
  };
  // Utility Functions
  const fetchElectionData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/election_data`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setElectionData(data);
    } catch (error) {
      setError(error);
    }
  };

  const getLeadingPartyByConstituency = (electionData) => {
    const leadingParties = {};
    let totalVotesAllConstituencies = 0;

    electionData.forEach((data) => {
      totalVotesAllConstituencies += data.Votes;

      // Initialize if not present
      if (!leadingParties[data.ConstituencyID]) {
        leadingParties[data.ConstituencyID] = {
          Party: null,
          Votes: 0,
          Color: "#485147",
        };
      }

      // Update if current party has more votes and votes are greater than zero
      if (
        data.Votes > leadingParties[data.ConstituencyID].Votes &&
        data.Votes > 0
      ) {
        leadingParties[data.ConstituencyID] = {
          Party: data.Party,
          Votes: data.Votes,
          Color: data.color,
          PartyName: data.PartyName,
        };
      }
    });
    return { leadingParties, totalVotesAllConstituencies };
  };

  // Find election data for the current feature
  const getElectionDataForFeature = (featureCst) => {
    const constituencyCandidates = electionData.filter(
      (data) => data.ConstituencyID === featureCst
    );
    return constituencyCandidates;
  };

  // useEffect Hooks
  // Fetching election data from the API
  useEffect(() => {
    fetchElectionData();
  }, []);

  // Compute Leading Parties
  useEffect(() => {
    const { leadingParties, totalVotesAllConstituencies } =
      getLeadingPartyByConstituency(electionData);
    setLeadingParties(leadingParties);
    setTotalVotes(totalVotesAllConstituencies);
  }, [electionData]);

  // Fetch geojsonData
  useEffect(() => {
    const geojsonURL = "/constituency_map.json";
    fetch(geojsonURL)
      .then((response) => response.json())
      .then((data) => setGeojsonData(data));
  }, []);

  // Event Handlers
  const handleAreaClick = (feature) => {
    setCurrentFeature(feature);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Reset the selected candidates when closing the modal
    if (currentFeature) {
      const candidates = getElectionDataForFeature(
        currentFeature.properties.cst
      );
      setSelectedCandidates(
        candidates.reduce((acc, candidate) => {
          acc[candidate.CandidateName] = false;
          return acc;
        }, {})
      );
    }
  };

  // Define votePercentages with useMemo
  const votePercentages = useMemo(() => {
    return currentFeature
      ? getElectionDataForFeature(currentFeature.properties.cst)
      : [];
  }, [currentFeature, electionData]);

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
      className="container mx-auto pt-7 mb-5"
      style={{ maxWidth: isSmallScreen ? "88%" : "85%" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          justifyContent: {
            md: "space-between",
          },
          alignItems: {
            md: "center",
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: {
              xs: "1.88rem",
              sm: "1.88rem",
              md: "2.125rem",
            },
            mb: {
              xs: 2,
              md: 0,
            },
            flexGrow: {
              md: 1,
            },
          }}
        >
          2024 Bangladeshi General Election Survey
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            // textAlign: {
            //   xs: "right", // Center-aligned text for xs
            //   md: "right", // Right-aligned text for md and upwards
            // },
            width: {
              xs: "100%",
              md: "auto",
            },
          }}
        >
          Total Participants in Poll: {totalVotes}
        </Typography>
      </Box>
      <div className="my-5">
        <Divider variant="fullwidth" sx={{ borderColor: "#ffffff" }} />
      </div>
      <Grid2 xs={12} md={12}>
        <DashboardPaper>
          <Typography
            variant={isSmallScreen ? "subtitle1" : "h6"}
            className={`!mb-4 ${isSmallScreen ? "!text-sm" : "!text-lg"}`}
          >
            Constituency Wining projection
          </Typography>
          {Object.keys(leadingParties).length > 0 && (
            <PartyGrid leadingParties={leadingParties} />
          )}
        </DashboardPaper>
      </Grid2>
      <Grid2 xs={12} md={12} pt={3}>
        <DashboardPaper>
          <Typography
            variant={isSmallScreen ? "subtitle1" : "h6"}
            className={`!mb-4 ${isSmallScreen ? "!text-sm" : "!text-lg"}`}
          >
            Click on the Constituency to see details
          </Typography>
          <MapContainer
            attributionControl={false}
            center={[23.685, 90.3563]}
            // zoom={defaultZoom}
            style={{ height: mapHeight, width: "100%", borderRadius: "8px" }}
            minZoom={defaultZoom}
            maxZoom={11.5}
          >
            {geojsonData && (
              <MapLogicComponent
                geojsonData={geojsonData}
                onAreaClick={handleAreaClick}
                leadingParties={leadingParties}
              />
            )}
          </MapContainer>
        </DashboardPaper>
      </Grid2>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Constituency Details
          </Typography>
          {currentFeature && (
            <>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Constituency ID: {currentFeature.properties.cst}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Constituency Name: {currentFeature.properties.cst_n}
              </Typography>
              <VotePercentageBarChart votePercentages={votePercentages} />
              <CandidateDetailsTable
                data={
                  currentFeature
                    ? getElectionDataForFeature(currentFeature.properties.cst)
                    : []
                }
                selectedCandidates={selectedCandidates}
                setSelectedCandidates={setSelectedCandidates}
                onVoteSuccess={fetchElectionData} // Pass fetchElectionData here
              />
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Constituencies;
