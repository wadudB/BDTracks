import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableCell,
} from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";
import PropTypes from "prop-types";
import { Checkbox, Button } from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import MuiToolTip from "@mui/material/Tooltip";

// Table component for displaying candidate details
const CandidateDetailsTable = ({
  data,
  selectedCandidates,
  setSelectedCandidates,
  onVoteSuccess,
}) => {
  const CustomButton = styled(Button)(() => ({
    // Apply styles when the button is disabled
    "&.Mui-disabled": {
      color: "rgb(255 255 255 / 26%)",
      boxShadow: "none",
      backgroundColor: "rgb(255 255 255 / 12%)",
    },
  }));
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
          backgroundColor: "#061434",
          minWidth: 300,
          border: "1px solid white",
        }}
        aria-label="candidate details table"
      >
        <TableHead style={{ backgroundColor: "#060522" }}>
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
                  // disabled={row.CandidateName === "Nomination Withdrawn"}
                  disabled={true}
                />
              </TableCell>
              <TableCell style={{ color: "white" }} align="right">
                <CustomButton
                  variant="contained"
                  color="primary"
                  onClick={() => handleVote(row.CandidateId)}
                  // disabled={
                  //   !selectedCandidates[row.CandidateName] ||
                  //   row.CandidateName === "Nomination Withdrawn"
                  // }
                  disabled={true}
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

export default CandidateDetailsTable;
