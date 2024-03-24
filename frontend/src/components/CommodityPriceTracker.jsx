import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";

const StyledTableCell = styled(TableCell)(() => ({
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

function CommodityPriceTracker({ commodityData }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 400 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Commodity Name</StyledTableCell>
              <StyledTableCell align="right">Commodity Price</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {commodityData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell component="th" scope="row">
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.price}</StyledTableCell>
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
}

CommodityPriceTracker.propTypes = {
  commodityData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
};

export default CommodityPriceTracker;
