import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import PropTypes from "prop-types";

const LatestAccidents = ({ accidentData }) => {
  const cellStyle = { color: "white" };

  return (
    <TableContainer
      component={Paper}
      className="shadow-lg"
      style={{ backgroundColor: "#202940" }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={cellStyle}>Date Time</TableCell>
            <TableCell sx={cellStyle} align="right">
              Injured
            </TableCell>
            <TableCell sx={cellStyle} align="right">
              Killed
            </TableCell>
            <TableCell sx={cellStyle} align="right">
              Location
            </TableCell>
            <TableCell sx={cellStyle} align="right">
              District
            </TableCell>
            <TableCell sx={cellStyle} align="right">
              Accident Type
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {accidentData.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={cellStyle} component="th" scope="row">
                {row["ACCIDENT Datetime_from_url"] || "Not Available"}
              </TableCell>
              <TableCell sx={cellStyle} align="right">
                {row["Total Number of People Injured"] || "Not Available"}
              </TableCell>
              <TableCell sx={cellStyle} align="right">
                {row["Total Number of People Killed"] || "Not Available"}
              </TableCell>
              <TableCell sx={cellStyle} align="right">
                {row["Exact Location of Accident"] || "Not Available"}
              </TableCell>
              <TableCell sx={cellStyle} align="right">
                {row["District of Accident"] || "Not Available"}
              </TableCell>
              <TableCell sx={cellStyle} align="right">
                {row["Accident_Type"] || "Not Available"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LatestAccidents;

LatestAccidents.propTypes = {
  accidentData: PropTypes.arrayOf(
    PropTypes.shape({
      "ACCIDENT Datetime_from_url": PropTypes.string.isRequired,
      "Total Number of People Injured": PropTypes.string.isRequired,
      "Total Number of People Killed": PropTypes.string.isRequired,
      "Exact Location of Accident": PropTypes.string.isRequired,
      "District of Accident": PropTypes.string.isRequired,
      Accident_Type: PropTypes.string.isRequired,
    })
  ).isRequired,
};
