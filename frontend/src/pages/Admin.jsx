import React, { useState, useEffect } from "react";
import LoginPanel from "../components/LoginPanel";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import {
  Typography,
  Box,
  Unstable_Grid2 as Grid2,
  CircularProgress,
  Button,
  Modal,
  TextField,
  MenuItem,
} from "@mui/material";

const DashboardPaper = React.lazy(() => import("../components/DashboardPaper"));
const AdminConstituency = React.lazy(() =>
  import("../components/AdminConstituency ")
);
const AdminParty = React.lazy(() => import("../components/AdminParty"));

const WhiteTextField = styled(TextField)(({ theme }) => ({
  "& label": {
    color: "grey",
  },
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "grey",
    },
    "&:hover fieldset": {
      borderColor: "grey",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.text.highlight,
    },
  },
}));

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [token, setToken] = useState("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [commodityData, setCommodityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);
  const [parties, setParties] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [partyId, setPartyId] = useState("");
  const [constituencyId, setConstituencyId] = useState("");
  const [refreshData, setRefreshData] = useState(false);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleClosePartyModal = () => setIsPartyModalOpen(false);
  const [candidateName, setCandidateName] = useState("");
  const [alliance, setAlliance] = useState("");
  const [partyName, setPartyName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [color, setColor] = useState("");
  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleLoginSuccess = (token) => {
    localStorage.setItem("authToken", token);
    setToken(token);
    setIsLoggedIn(true);
  };

  // Check if there's a token in local storage to auto-login
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const fetchCommodityData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/election_data`);
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

  useEffect(() => {
    if (isLoggedIn) {
      fetchCommodityData();
    }
  }, [isLoggedIn, refreshData]);

  const fetchParties = async () => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const response = await fetch(`${apiUrl}/parties`);
    if (!response.ok) throw new Error("Could not fetch parties");
    const data = await response.json();
    setParties(data);
  };

  const fetchConstituencies = async () => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const response = await fetch(`${apiUrl}/constituencies`);
    if (!response.ok) throw new Error("Could not fetch constituencies");
    const data = await response.json();
    setConstituencies(data);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchParties();
      fetchConstituencies();
    }
  }, [isLoggedIn, refreshData]);

  // useEffect(() => {
  //   const fetchParties = async () => {
  //     const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  //     const response = await fetch(`${apiUrl}/parties`);
  //     if (!response.ok) throw new Error("Could not fetch parties");
  //     const data = await response.json();
  //     setParties(data);
  //     console.log(parties);
  //   };

  //   fetchParties();
  // }, []);

  // useEffect(() => {
  //   const fetchConstituencies = async () => {
  //     const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  //     const response = await fetch(`${apiUrl}/constituencies`);
  //     if (!response.ok) throw new Error("Could not fetch constituencies");
  //     const data = await response.json();
  //     setConstituencies(data);
  //     console.log(constituencies);
  //   };

  //   fetchConstituencies();
  // }, []);

  if (!isLoggedIn) {
    return <LoginPanel onLoginSuccess={handleLoginSuccess} />;
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handlePartyOpenModal = () => {
    setIsPartyModalOpen(true);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const candidateData = {
      name: candidateName,
      party_id: partyId,
      constituency_id: constituencyId,
    };

    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/add-candidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(candidateData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to add commodity");
      }

      setSnackbarInfo({
        open: true,
        message: "Candidate added successfully!",
        severity: "success",
      });

      // Clear the form fields
      setCandidateName("");
      setPartyId("");
      setConstituencyId("");
      setRefreshData(true);
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: error.message || "Error adding candidate",
        severity: "error",
      });
    }

    // Close the modal after submission
    handleCloseModal();
  };

  const handlePartyFormSubmit = async (event) => {
    event.preventDefault();

    const partyData = {
      alliance: alliance,
      party: partyName,
      symbol: abbreviation,
      color: color,
    };
    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/add-party`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partyData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to add commodity");
      }

      setSnackbarInfo({
        open: true,
        message: "Party added successfully!",
        severity: "success",
      });

      // Clear the form fields
      setAlliance("");
      setPartyName("");
      setAbbreviation("");
      setColor("");
      setRefreshData(true);
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: error.message || "Error adding Party",
        severity: "error",
      });
    }

    // Close the modal after submission
    handleCloseModal();
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="85vh"
      >
        <CircularProgress />
      </Box>
    );
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

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarInfo({ ...snackbarInfo, open: false });
  };

  return (
    <Box
      className="container mx-auto pt-7 mb-5"
      style={{ maxWidth: isSmallScreen ? "88%" : "85%" }}
    >
      {/* Alert Component */}
      <Snackbar
        open={snackbarInfo.open}
        autoHideDuration={10000} // Hide after 10 seconds
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarInfo.severity}
          sx={{ width: "100%" }}
        >
          {snackbarInfo.message}
        </Alert>
      </Snackbar>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} container spacing={2}>
          <Grid2 xs={12} md={12}>
            <DashboardPaper>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "10px",
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
                  Candidates List
                </Typography>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "white",
                      borderColor: "white",
                      "&:hover": {
                        backgroundColor: theme.palette.text.highlight,
                        borderColor: "black",
                      },
                    }}
                    onClick={handleOpenModal}
                  >
                    Add Candidate
                  </Button>
                </div>
              </div>
              {/* <div className="my-5">
        <Divider variant="fullwidth" sx={{ borderColor: "#ffffff" }} />
      </div> */}

              <AdminConstituency
                commodityData={commodityData}
                setCommodityData={setCommodityData}
                fetchCommodityData={fetchCommodityData}
                parties={parties}
                constituencies={constituencies}
              />
            </DashboardPaper>
          </Grid2>
        </Grid2>
      </Grid2>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#060522",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Add Candidate
          </Typography>
          <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
            <WhiteTextField
              label="Candidate Name"
              fullWidth
              margin="normal"
              variant="outlined"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              required
            />
            <WhiteTextField
              fullWidth
              margin="normal"
              select
              label="Party"
              variant="outlined"
              value={partyId}
              onChange={(e) => setPartyId(e.target.value)}
              required
            >
              {parties.map((party) => (
                <MenuItem key={party.party_id} value={party.party_id}>
                  {party.party}
                </MenuItem>
              ))}
            </WhiteTextField>
            <WhiteTextField
              fullWidth
              margin="normal"
              select
              label="Constituency"
              variant="outlined"
              value={constituencyId}
              onChange={(e) => setConstituencyId(e.target.value)}
              required
            >
              {constituencies.map((constituency) => (
                <MenuItem key={constituency.id} value={constituency.id}>
                  {constituency.name}
                </MenuItem>
              ))}
            </WhiteTextField>
            <Button
              type="submit"
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "white",
                mt: 2,
                "&:hover": {
                  backgroundColor: theme.palette.text.highlight,
                  borderColor: "black",
                },
              }}
            >
              Register Candidate
            </Button>
          </Box>
        </Box>
      </Modal>
      <Grid2 container spacing={2} pt={5}>
        <Grid2 xs={12} container spacing={2}>
          <Grid2 xs={12} md={12}>
            <DashboardPaper>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "10px",
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
                  Party List
                </Typography>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "white",
                      borderColor: "white",
                      "&:hover": {
                        backgroundColor: theme.palette.text.highlight,
                        borderColor: "black",
                      },
                    }}
                    onClick={handlePartyOpenModal}
                  >
                    Add Party
                  </Button>
                </div>
              </div>
              <AdminParty
                // commodityData={commodityData}
                setParties={setParties}
                fetchParties={fetchParties}
                parties={parties}
              />
            </DashboardPaper>
          </Grid2>
        </Grid2>
      </Grid2>
      <Modal open={isPartyModalOpen} onClose={handleClosePartyModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#060522",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Add Party
          </Typography>
          <Box component="form" onSubmit={handlePartyFormSubmit} sx={{ mt: 2 }}>
            <WhiteTextField
              label="Alliance Name"
              fullWidth
              margin="normal"
              variant="outlined"
              value={alliance}
              onChange={(e) => setAlliance(e.target.value)}
              required
            />
            <WhiteTextField
              label="Party Name"
              fullWidth
              margin="normal"
              variant="outlined"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              required
            />
            <WhiteTextField
              label="Abbreviation"
              fullWidth
              margin="normal"
              variant="outlined"
              value={abbreviation}
              onChange={(e) => setAbbreviation(e.target.value)}
              required
            />
            <WhiteTextField
              label="Party Color"
              fullWidth
              margin="normal"
              variant="outlined"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "white",
                mt: 2,
                "&:hover": {
                  backgroundColor: theme.palette.text.highlight,
                  borderColor: "black",
                },
              }}
            >
              Register Alliance
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Admin;
