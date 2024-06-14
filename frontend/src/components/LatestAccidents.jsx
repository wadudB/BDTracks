import { useState } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
  TablePagination,
  Modal,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
const LatestAccidents = ({ latestAccidentData }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRow, setSelectedRow] = useState(null);
  const cellStyle = { color: theme.palette.text.primary };

  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#060522",
      color: theme.palette.text.primary,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      color: theme.palette.text.primary,
      backgroundColor: "#061434",
    },
  }));
  const StyledTableRow = styled(TableRow)(() => ({
    "&:hover": {
      backgroundColor: "#060522",
      "& > .MuiTableCell-root": {
        backgroundColor: "#060522",
      },
      cursor: "pointer",
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      borderColor: "#060522",
    },
  }));
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "90%" : 700,
    bgcolor: "#060522",
    border: "2px solid #000",
    boxShadow: 24,
    p: 2,
    borderRadius: "9px",
    overflowY: "auto",
    maxHeight: "90vh",
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function removeGMT(datetimeStr) {
    if (datetimeStr.endsWith(" GMT")) {
      // Remove the last 4 characters
      return datetimeStr.slice(0, -4);
    }
    return datetimeStr;
  }

  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
  };

  const convertToIntegerOrDefault = (value, defaultValue = "Not Available") => {
    if (value === null || value === undefined) {
      return defaultValue;
    }

    const number = parseFloat(value);
    if (!isNaN(number) && !isNaN(parseFloat(value))) {
      return Math.floor(number).toString();
    }

    return value;
  };

  return (
    <>
      <TableContainer
        component={Paper}
        className="shadow-lg"
        style={{ backgroundColor: "#061434" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={cellStyle}>Date Time (BDT)</StyledTableCell>
              <StyledTableCell sx={cellStyle} align="right">
                Injured
              </StyledTableCell>
              <StyledTableCell sx={cellStyle} align="right">
                Killed
              </StyledTableCell>
              <StyledTableCell sx={cellStyle} align="right">
                Location
              </StyledTableCell>
              <StyledTableCell sx={cellStyle} align="right">
                District
              </StyledTableCell>
              <StyledTableCell sx={cellStyle} align="right">
                Accident Type
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {latestAccidentData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <StyledTableRow key={index} onClick={() => handleRowClick(row)}>
                  <TableCell sx={cellStyle}>
                    {removeGMT(row.accident_datetime_from_url) ||
                      "Not Available"}
                  </TableCell>
                  <TableCell sx={cellStyle} align="right">
                    {convertToIntegerOrDefault(
                      row.total_number_of_people_injured
                    )}
                  </TableCell>
                  <TableCell sx={cellStyle} align="right">
                    {convertToIntegerOrDefault(
                      row.total_number_of_people_killed
                    )}
                  </TableCell>
                  <TableCell sx={cellStyle} align="right">
                    {row.exact_location_of_accident || "Not Available"}
                  </TableCell>
                  <TableCell sx={cellStyle} align="right">
                    {row.district_of_accident || "Not Available"}
                  </TableCell>
                  <TableCell sx={cellStyle} align="right">
                    {row.accident_type || "Not Available"}
                  </TableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={latestAccidentData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          ".MuiTablePagination-toolbar": {
            color: theme.palette.text.primary,
          },
          ".MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon":
            {
              color: theme.palette.text.primary,
            },
          ".MuiTablePagination-displayedRows": {
            color: theme.palette.text.primary,
          },
          ".MuiTablePagination-actions": {
            color: theme.palette.text.primary,
          },
          ".MuiTablePagination-actions button.Mui-disabled": {
            color: "#666666 !important",
          },
          ".MuiTablePagination-actions button:hover": {
            color: theme.palette.text.highlight,
          },
        }}
        slotProps={{
          select: {
            MenuProps: {
              sx: {
                ".MuiPaper-root": {
                  backgroundColor: "#061434",
                },
                ".MuiMenuItem-root": {
                  "&:hover": {
                    color: theme.palette.text.highlight,
                  },
                },
              },
            },
          },
        }}
      />
      <Modal
        open={Boolean(selectedRow)}
        onClose={handleCloseModal}
        aria-labelledby="accident-details-modal"
        aria-describedby="accident-details"
      >
        <Box sx={modalStyle}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            sx={{ mt: 1, color: theme.palette.text.primary }}
          >
            Details Report
          </Typography>
          <p id="accident-details">
            {selectedRow && (
              <>
                <Typography
                  id="modal-modal-description"
                  variant="body2"
                  sx={{ mt: 2, color: theme.palette.text.primary }}
                >
                  Injured:{" "}
                  {convertToIntegerOrDefault(
                    selectedRow.total_number_of_people_injured
                  )}
                </Typography>
                <Typography
                  id="modal-modal-description"
                  variant="body2"
                  sx={{ mt: 1, color: theme.palette.text.primary }}
                >
                  Killed:{" "}
                  {convertToIntegerOrDefault(
                    selectedRow.total_number_of_people_killed
                  )}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 1, color: theme.palette.text.primary }}
                >
                  Date & Time (BDT): {selectedRow.accident_datetime_from_url}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 1, color: theme.palette.text.primary }}
                >
                  Location: {selectedRow.exact_location_of_accident}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ mt: 3, color: theme.palette.text.primary }}
                >
                  {selectedRow.headline}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ mt: 1, color: theme.palette.text.primary }}
                >
                  {selectedRow.summary}
                </Typography>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    sx={{
                      backgroundColor: "#061434",
                      color: theme.palette.text.primary,

                      "&:hover": {
                        color: theme.palette.text.highlight,
                      },
                    }}
                    onClick={handleCloseModal}
                  >
                    Close
                  </Button>
                </Box>
              </>
            )}
          </p>
        </Box>
      </Modal>
    </>
  );
};

// PropTypes
LatestAccidents.propTypes = {
  latestAccidentData: PropTypes.arrayOf(
    PropTypes.shape({
      accident_datetime_from_url: PropTypes.string,
      total_number_of_people_injured: PropTypes.string,
      total_number_of_people_killed: PropTypes.string,
      exact_location_of_accident: PropTypes.string,
      district_of_accident: PropTypes.string,
      accident_type: PropTypes.string,
    })
  ).isRequired,
};

export default LatestAccidents;
