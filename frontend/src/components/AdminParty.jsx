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
import { useTheme } from "@mui/material/styles";

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#060522",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: "white",
    backgroundColor: "#061434",
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#061434",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#1b263b",
  },
  "&:hover": {
    backgroundColor: "#060522",
    "& > .MuiTableCell-root": {
      backgroundColor: "#060522",
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
  const theme = useTheme();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Edit Data
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

      // Close modal
      setEditModalOpen(false);
      // Update Party data
      fetchParties();

      alert("Party updated successfully");
    } catch (error) {
      alert("Failed to update Party");
    }
  };

  // Delete party
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

        // Refresh the list
        const updatedData = parties.filter(
          (candidate) => candidate.party !== row.party
        );
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
            color: "white", // Pagination toolbar text
          },
          ".MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon":
            {
              color: "white", // Icon
            },
          ".MuiTablePagination-displayedRows": {
            color: "white", // Rows text
          },
          ".MuiTablePagination-actions": {
            color: "white", // Navigation arrows
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
            bgcolor: "#060522",
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
                  backgroundColor: theme.palette.text.highlight,
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

// PropTypes
AdminParty.propTypes = {
  setParties: PropTypes.func.isRequired,
  fetchParties: PropTypes.func.isRequired,
  parties: PropTypes.array.isRequired,
};

export default AdminParty;
