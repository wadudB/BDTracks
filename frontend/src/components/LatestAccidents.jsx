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

const LatestAccidents = ({ latestAccidentData }) => {
  const cellStyle = { color: "white" };

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
          {latestAccidentData.map((row, index) => (
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
