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

  const latestAccidents = accidentData.slice(0, 7);

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
          {latestAccidents.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={cellStyle} component="th" scope="row">
                {row.accident_datetime_from_url || "Not Available"}
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
  );
};
LatestAccidents.propTypes = {
  accidentData: PropTypes.arrayOf(
    PropTypes.shape({
      accident_datetime_from_url: PropTypes.string.isRequired,
      total_number_of_people_injured: PropTypes.string.isRequired,
      total_number_of_people_killed: PropTypes.string.isRequired,
      exact_location_of_accident: PropTypes.string.isRequired,
      district_of_accident: PropTypes.string.isRequired,
      accident_type: PropTypes.string.isRequired,
    })
  ).isRequired,
};
export default LatestAccidents;
