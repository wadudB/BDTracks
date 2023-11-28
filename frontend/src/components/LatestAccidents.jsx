import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const trafficData = [
  {
    source: "Google",
    users: 1023,
    sessions: 1265,
    bounceRate: "30%",
    duration: "00:06:25",
  },
  {
    source: "Google",
    users: 1023,
    sessions: 1265,
    bounceRate: "30%",
    duration: "00:06:25",
  },
  {
    source: "Google",
    users: 1023,
    sessions: 1265,
    bounceRate: "30%",
    duration: "00:06:25",
  },
  {
    source: "Google",
    users: 1023,
    sessions: 1265,
    bounceRate: "30%",
    duration: "00:06:25",
  },
  {
    source: "Google",
    users: 1023,
    sessions: 1265,
    bounceRate: "30%",
    duration: "00:06:25",
  },
];

const LatestAccidents = () => {
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
            <TableCell sx={cellStyle}>Source</TableCell>
            <TableCell sx={cellStyle} align="right">
              Users
            </TableCell>
            <TableCell sx={cellStyle} align="right">
              Sessions
            </TableCell>
            <TableCell sx={cellStyle} align="right">
              Bounce Rate
            </TableCell>
            <TableCell sx={cellStyle} align="right">
              Avg. Session Duration
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trafficData.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={cellStyle} component="th" scope="row">
                {row.source}
              </TableCell>
              <TableCell sx={cellStyle} align="right">
                {row.users}
              </TableCell>
              <TableCell sx={cellStyle} align="right">
                {row.sessions}
              </TableCell>
              <TableCell sx={cellStyle} align="right">
                {row.bounceRate}
              </TableCell>
              <TableCell sx={cellStyle} align="right">
                {row.duration}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LatestAccidents;
