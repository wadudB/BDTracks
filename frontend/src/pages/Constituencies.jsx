import {
  Typography,
  Box,
  Modal,
  Divider,
  Unstable_Grid2 as Grid2,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useEffect, useMemo } from "react";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../css/leaflet.css";
import DashboardPaper from "../components/DashboardPaper";
import PartyGrid from "../components/PartyGrid";
import VotePercentageBarChart from "../components/VotePercentageBarChart";
import MapLogicComponent from "../components/MapLogicComponent";
import CandidateDetailsTable from "../components/CandidateDetailsTable";

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
  const mapHeight = isSmallScreen ? "65vh" : "130vh";
  const defaultZoom = isSmallScreen ? 7.2 : 8;
  const [mapLoading, setMapLoading] = useState(true);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "90%" : 500,
    bgcolor: "#060522",
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
      style={{ maxWidth: isSmallScreen ? "92%" : "85%" }}
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
            <PartyGrid
              leadingParties={leadingParties}
              isSmallScreen={isSmallScreen}
            />
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
          {mapLoading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="85vh"
            >
              <CircularProgress />
            </Box>
          )}
          <MapContainer
            attributionControl={false}
            center={[23.685, 90.3563]}
            // zoom={defaultZoom}
            style={{ height: mapHeight, width: "100%", borderRadius: "8px" }}
            minZoom={defaultZoom}
            maxZoom={11.5}
            whenReady={() => setMapLoading(false)}
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
              <VotePercentageBarChart
                votePercentages={votePercentages}
                isSmallScreen={isSmallScreen}
              />
              <CandidateDetailsTable
                data={
                  currentFeature
                    ? getElectionDataForFeature(currentFeature.properties.cst)
                    : []
                }
                selectedCandidates={selectedCandidates}
                setSelectedCandidates={setSelectedCandidates}
                onVoteSuccess={fetchElectionData}
              />
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Constituencies;
