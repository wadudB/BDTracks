import React from "react";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import {
  Typography,
  Box,
  Unstable_Grid2 as Grid2,
  Divider,
  CircularProgress,
  Button,
  Modal,
  TextField,
} from "@mui/material";

const DashboardPaper = React.lazy(() => import("../components/DashboardPaper"));
const CommodityPriceTracker = React.lazy(() =>
  import("../components/CommodityPriceTracker")
);

const WhiteTextField = styled(TextField)({
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
      borderColor: "#c77676",
    },
  },
});

const Commodities = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [commodityData, setCommodityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const [commodityName, setCommodityName] = useState("");
  const [commodityPrice, setCommodityPrice] = useState("");
  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Data to be sent
    const commodityDataToSend = {
      name: commodityName,
      price: commodityPrice,
    };

    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/add-commodity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commodityDataToSend),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to add commodity");
      }

      setSnackbarInfo({
        open: true,
        message: "Commodity added successfully!",
        severity: "success",
      });

      // clear the form fields
      setCommodityName("");
      setCommodityPrice("");
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: error.message || "Error adding commodity",
        severity: "error",
      });
    }

    // Close the modal after submission
    handleCloseModal();
  };

  useEffect(() => {
    // Asynchronous function to fetch commodity data
    const fetchCommodityData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}/commodity-data`);
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
    fetchCommodityData();
  }, []);

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
          Commodity Price Tracker
        </Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": {
                backgroundColor: "#c77676",
                borderColor: "black",
              },
            }}
            onClick={handleOpenModal}
          >
            Add New
          </Button>
        </div>
      </div>
      <div className="my-5">
        <Divider variant="fullwidth" sx={{ borderColor: "#ffffff" }} />
      </div>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} container spacing={2}>
          <Grid2 xs={12} md={12}>
            <DashboardPaper>
              <CommodityPriceTracker commodityData={commodityData} />
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
            bgcolor: "#141d33",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Add New Commodity
          </Typography>
          <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
            <WhiteTextField
              required
              fullWidth
              margin="normal"
              label="Commodity Name"
              variant="outlined"
              value={commodityName}
              onChange={(e) => setCommodityName(e.target.value)}
            />
            <WhiteTextField
              required
              fullWidth
              margin="normal"
              label="Commodity Price"
              variant="outlined"
              type="number"
              value={commodityPrice}
              onChange={(e) => setCommodityPrice(e.target.value)}
            />
            <Button
              type="submit"
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "white",
                mt: 2,
                "&:hover": {
                  backgroundColor: "#c77676",
                  borderColor: "black",
                },
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Commodities;
