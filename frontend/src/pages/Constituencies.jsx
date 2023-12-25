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
import React, { useState, useEffect } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../css/leaflet.css";
import PropTypes from "prop-types";

const DashboardPaper = React.lazy(() => import("../components/DashboardPaper"));

// Modal style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "#141d33",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
  borderRadius: "9px",
};

// Map style
const CustomMapContainer = styled(MapContainer)({
  backgroundColor: "transparent",
  height: "1000px",
  width: "100%",
  borderRadius: "8px",
});

// Table component for displaying candidate details
const CandidateDetailsTable = ({ data }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
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
            <TableCell align="right" style={{ color: "white" }}>
              Party
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row" style={{ color: "white" }}>
                {row.Candidate}
              </TableCell>
              <TableCell align="right" style={{ color: "white" }}>
                {row.Party}
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
      Candidate: PropTypes.string.isRequired,
      Party: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const ConstituencyLabels = ({ geojsonData, onAreaClick }) => {
  const map = useMap();

  useEffect(() => {
    if (geojsonData) {
      const markers = geojsonData.features.map((feature) => {
        const centroid = L.geoJSON(feature.geometry).getBounds().getCenter();
        const marker = L.marker(centroid, {
          icon: L.divIcon({
            className: "constituency-label",
            html: feature.properties.cst.toString(),
          }),
        });
        marker.on("click", () => onAreaClick(feature));
        return marker;
      });

      const markersGroup = L.featureGroup(markers).addTo(map);

      return () => {
        markersGroup.clearLayers();
      };
    }
  }, [geojsonData, map, onAreaClick]);

  return null;
};

const Constituencies = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [geojsonData, setGeojsonData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(null);
  const [error, setError] = useState(null);
  const [electionData, setElectionData] = useState([]);

  useEffect(() => {
    const geojsonURL = "/constituency_map.json";
    fetch(geojsonURL)
      .then((response) => response.json())
      .then((data) => setGeojsonData(data));
  }, []);

  const handleAreaClick = (feature) => {
    setCurrentFeature(feature);
    setModalOpen(true);
  };
  // Fetching election data from the API
  useEffect(() => {
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
    fetchElectionData();
  }, []);

  // Find election data for the current feature
  const getElectionDataForFeature = (featureCst) => {
    const constituencyData = electionData.find(
      (data) => data.cst === featureCst
    );
    if (!constituencyData) return [];

    const candidates = [];
    for (let i = 1; i <= 3; i++) {
      // up to 3 candidates per constituency
      const candidateKey = `Candidate${i === 1 ? "" : i}`;
      const partyKey = `Party${i === 1 ? "" : i}`;
      if (constituencyData[candidateKey]) {
        candidates.push({
          Candidate: constituencyData[candidateKey],
          Party: constituencyData[partyKey],
        });
      }
    }

    return candidates;
  };
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
          2024 Bangladeshi general election Constituencies & Candidates
        </Typography>
      </div>
      <div className="my-5">
        <Divider variant="fullwidth" sx={{ borderColor: "#ffffff" }} />
      </div>
      <Grid2 xs={12} md={12}>
        <DashboardPaper>
          <Typography variant="subtitle2" className="!mb-4 !text-lg">
            Real-Time
          </Typography>
          <CustomMapContainer center={[23.685, 90.3563]} zoom={8}>
            {geojsonData && (
              <GeoJSON
                data={geojsonData}
                style={() => ({
                  fillColor: "#244999",
                  fillOpacity: "1",
                  color: "white",
                  weight: 1,
                })}
              />
            )}
            {geojsonData && (
              <ConstituencyLabels
                geojsonData={geojsonData}
                onAreaClick={handleAreaClick}
              />
            )}
          </CustomMapContainer>
        </DashboardPaper>
      </Grid2>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Constituency Details
          </Typography>
          {currentFeature && ( // Check if currentFeature is not null
            <>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Name: {currentFeature.properties.cst_n}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Number: {currentFeature.properties.cst}
              </Typography>
              {/* Fetch and display election data */}
              <CandidateDetailsTable
                data={
                  currentFeature
                    ? getElectionDataForFeature(currentFeature.properties.cst)
                    : []
                }
              />
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

ConstituencyLabels.propTypes = {
  geojsonData: PropTypes.shape({
    features: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        geometry: PropTypes.shape({
          type: PropTypes.string.isRequired,
          coordinates: PropTypes.array.isRequired,
        }).isRequired,
        properties: PropTypes.shape({
          cst: PropTypes.number.isRequired,
          cst_n: PropTypes.string.isRequired,
          // Include other properties as necessary
        }).isRequired,
      })
    ).isRequired,
  }).isRequired,
  onAreaClick: PropTypes.func.isRequired,
};

export default Constituencies;
