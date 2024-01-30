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

import { Typography, Box, Button, Modal, TextField } from "@mui/material";

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

const AdminParty = ({ setParties, fetchParties, parties }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingParty, setEditingParty] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle edit click for a row
  const handleEditClick = (party) => {
    setEditingParty(party);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const partyData = {
      alliance: editingParty.alliance,
      party: editingParty.party,
      symbol: editingParty.symbol,
      color: editingParty.color,
    };

    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const response = await fetch(
        `${apiUrl}/parties/${editingParty.party_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(partyData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update Party");
      }

      // Close the modal
      setEditModalOpen(false);
      // Update local state with the new candidate data
      fetchParties();

      alert("Party updated successfully");
    } catch (error) {
      alert("Failed to update Party");
    }
  };

  // Handle delete click for a row
  const handleDeleteClick = async (row) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${row.party}?`
    );
    if (confirmDelete) {
      try {
        const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}/parties/${row.party_id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error deleting Party");
        }

        // Refresh the list or remove the item from the state
        const updatedData = parties.filter(
          (candidate) => candidate.party !== row.party
        );
        // Update the state
        setParties(updatedData);

        alert("Party deleted successfully");
      } catch (error) {
        alert("Failed to delete Party");
      }
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 400 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>No.</StyledTableCell>
              <StyledTableCell align="center">Alliance</StyledTableCell>
              <StyledTableCell align="center">Party</StyledTableCell>
              <StyledTableCell align="center">Abbreviation</StyledTableCell>
              <StyledTableCell align="center">Color</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parties
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <StyledTableRow key={row.party_id}>
                  <StyledTableCell component="th" scope="row">
                    {row.party_id}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.alliance}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.party}</StyledTableCell>
                  <StyledTableCell align="center">{row.symbol}</StyledTableCell>
                  <StyledTableCell align="center">{row.color}</StyledTableCell>
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
        count={parties.length}
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
              label="Party Name"
              fullWidth
              margin="normal"
              variant="outlined"
              value={editingParty?.party}
              onChange={(e) =>
                setEditingParty({
                  ...editingParty,
                  party: e.target.value,
                })
              }
              required
            />
            <WhiteTextField
              label="Party Abbreviation"
              fullWidth
              margin="normal"
              variant="outlined"
              value={editingParty?.symbol}
              onChange={(e) =>
                setEditingParty({
                  ...editingParty,
                  symbol: e.target.value,
                })
              }
              required
            />
            <WhiteTextField
              label="Alliance"
              fullWidth
              margin="normal"
              variant="outlined"
              value={editingParty?.alliance}
              onChange={(e) =>
                setEditingParty({
                  ...editingParty,
                  alliance: e.target.value,
                })
              }
              required
            />
            <WhiteTextField
              label="Color"
              fullWidth
              margin="normal"
              variant="outlined"
              value={editingParty?.color}
              onChange={(e) =>
                setEditingParty({
                  ...editingParty,
                  color: e.target.value,
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

AdminParty.propTypes = {
  setParties: PropTypes.func.isRequired,
  fetchParties: PropTypes.func.isRequired,
  parties: PropTypes.array.isRequired,
};

export default AdminParty;
