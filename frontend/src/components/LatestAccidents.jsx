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
} from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#060522",
    color: "#CBD5E1",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: "#CBD5E1",
    backgroundColor: "#061434",
  },
}));

const LatestAccidents = ({ latestAccidentData }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const cellStyle = { color: "#CBD5E1" };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function removeGMT(datetimeStr) {
    // Assuming the format is something like '2023-03-28 12:00:00 GMT'
    if (datetimeStr.endsWith(" GMT")) {
      return datetimeStr.slice(0, -4); // Remove the last 4 characters
    }
    return datetimeStr;
  }

  // const latestAccidents = accidentData.slice(0, 7);

  // Utc timestamp
  // const formatLocalDateTime = (datetime) => {
  //   if (!datetime) return "Not Available";

  //   // Parse the datetime
  //   // Format: 'YYYY-MM-DD HH:mm:ss'
  //   const [datePart, timePart] = datetime.split(" ");
  //   const [year, month, day] = datePart.split("-").map(Number);
  //   const [hours, minutes, seconds] = timePart.split(":").map(Number);

  //   // Create a Date object in UTC+6
  //   const date = new Date(
  //     Date.UTC(year, month - 1, day, hours - 6, minutes, seconds)
  //   );

  //   // Check if the date is valid
  //   if (isNaN(date.getTime())) return "Invalid Date";

  //   // Format the date in the local timezone
  //   return date.toLocaleString();
  // };

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
                <TableRow key={index}>
                  <TableCell sx={cellStyle} component="th" scope="row">
                    {removeGMT(row.accident_datetime_from_url) ||
                      "Not Available"}
                  </TableCell>
                  <TableCell sx={cellStyle} align="right">
                    {Math.floor(row.total_number_of_people_injured) ||
                      "Not Available"}
                  </TableCell>
                  <TableCell sx={cellStyle} align="right">
                    {Math.floor(row.total_number_of_people_killed) ||
                      "Not Available"}
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
                </TableRow>
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
            color: "#CBD5E1",
          },
          ".MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon":
            {
              color: "#CBD5E1",
            },
          ".MuiTablePagination-displayedRows": {
            color: "#CBD5E1",
          },
          ".MuiTablePagination-actions": {
            color: "#CBD5E1",
          },
        }}
      />
    </>
  );
};
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
