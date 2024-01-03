import { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";

import {
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
} from "@mui/material";

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
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#141d33",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: "white",
    backgroundColor: "#202940",
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#202940",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#1b263b",
  },
  "&:hover": {
    backgroundColor: "#141d33",
    "& > .MuiTableCell-root": {
      backgroundColor: "#141d33",
    },
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const AdminConstituency = ({
  commodityData,
  setCommodityData,
  fetchCommodityData,
  parties,
  constituencies,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle edit click for a row
  const handleEditClick = (candidate) => {
    setEditingCandidate(candidate);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    const candidateData = {
      name: editingCandidate.CandidateName,
      party_id: editingCandidate.party_id,
      constituency_id: editingCandidate.ConstituencyID,
      votes: editingCandidate.Votes,
    };

    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const response = await fetch(
        `${apiUrl}/candidates/${editingCandidate.CandidateId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(candidateData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update candidate");
      }

      // Close the modal
      setEditModalOpen(false);
      // Update local state with the new candidate data
      fetchCommodityData();

      alert("Candidate updated successfully");
    } catch (error) {
      console.error("Failed to update candidate:", error);
      alert("Failed to update candidate");
    }
  };

  // Handle delete click for a row
  const handleDeleteClick = async (row) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${row.CandidateName}?`
    );
    if (confirmDelete) {
      try {
        const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
        const response = await fetch(
          `${apiUrl}/candidates/${row.CandidateId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error deleting candidate");
        }

        // Refresh the list or remove the item from the state
        const updatedData = commodityData.filter(
          (candidate) => candidate.CandidateId !== row.CandidateId
        );
        // Update the state
        setCommodityData(updatedData);

        alert("Candidate deleted successfully");
      } catch (error) {
        console.error("Failed to delete candidate:", error);
        alert("Failed to delete candidate");
      }
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 400 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Cst No</StyledTableCell>
              <StyledTableCell align="center">Constituency</StyledTableCell>
              <StyledTableCell align="center">Candidate</StyledTableCell>
              <StyledTableCell align="center">Party</StyledTableCell>
              <StyledTableCell align="center">Vote</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {commodityData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <StyledTableRow key={row.CandidateId}>
                  <StyledTableCell component="th" scope="row">
                    {row.ConstituencyID}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.ConstituencyName}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.CandidateName}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.PartyName}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.Votes || "0"}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton
                      onClick={() => handleEditClick(row)}
                      color="primary"
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(row)}
                      color="secondary"
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 15, 25]}
        component="div"
        count={commodityData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          ".MuiTablePagination-toolbar": {
            color: "white", // Change the pagination toolbar text to white
          },
          ".MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon":
            {
              color: "white", // Change the select and icon to white
            },
          ".MuiTablePagination-displayedRows": {
            color: "white", // Change the displayed rows text to white
          },
          ".MuiTablePagination-actions": {
            color: "white", // Change the actions navigation arrows to white
          },
        }}
      />
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        aria-labelledby="edit-candidate-modal"
        aria-describedby="modal-modal-description"
      >
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
            Edit Candidate
          </Typography>
          <Box component="form" onSubmit={handleEditSubmit} sx={{ mt: 2 }}>
            <WhiteTextField
              label="Candidate Name"
              fullWidth
              margin="normal"
              variant="outlined"
              value={editingCandidate?.CandidateName}
              onChange={(e) =>
                setEditingCandidate({
                  ...editingCandidate,
                  CandidateName: e.target.value,
                })
              }
              required
            />
            <WhiteTextField
              select
              label="Party"
              fullWidth
              margin="normal"
              variant="outlined"
              value={editingCandidate?.party_id}
              onChange={(e) =>
                setEditingCandidate({
                  ...editingCandidate,
                  party_id: e.target.value,
                })
              }
              required
            >
              {parties.map((party) => (
                <MenuItem key={party.party_id} value={party.party_id}>
                  {party.party}
                </MenuItem>
              ))}
            </WhiteTextField>
            <WhiteTextField
              select
              label="Constituency"
              fullWidth
              margin="normal"
              variant="outlined"
              value={editingCandidate?.ConstituencyID}
              onChange={(e) =>
                setEditingCandidate({
                  ...editingCandidate,
                  ConstituencyID: e.target.value,
                })
              }
              required
            >
              {constituencies.map((constituency) => (
                <MenuItem key={constituency.id} value={constituency.id}>
                  {constituency.name}
                </MenuItem>
              ))}
            </WhiteTextField>
            <WhiteTextField
              label="Votes"
              fullWidth
              margin="normal"
              variant="outlined"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              value={editingCandidate?.Votes || 0}
              onChange={(e) =>
                setEditingCandidate({
                  ...editingCandidate,
                  Votes: e.target.value,
                })
              }
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
                  backgroundColor: "#c77676",
                  borderColor: "black",
                },
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

AdminConstituency.propTypes = {
  commodityData: PropTypes.arrayOf(
    PropTypes.shape({
      CandidateId: PropTypes.number.isRequired,
      ConstituencyID: PropTypes.number,
      ConstituencyName: PropTypes.string,
      CandidateName: PropTypes.string,
      PartyName: PropTypes.string,
      Votes: PropTypes.number,
    })
  ).isRequired,
  setCommodityData: PropTypes.func.isRequired,
  fetchCommodityData: PropTypes.func.isRequired,
  parties: PropTypes.arrayOf(
    PropTypes.shape({
      party_id: PropTypes.number.isRequired,
      party: PropTypes.string,
    })
  ).isRequired,
  constituencies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
    })
  ).isRequired,
};

export default AdminConstituency;
