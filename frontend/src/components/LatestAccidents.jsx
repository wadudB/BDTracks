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
  // ... add other sources here
];

const LatestAccidents = () => {
  return (
    <TableContainer
      component={Paper}
      className="shadow-lg"
      style={{ backgroundColor: "#202940" }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Source</TableCell>
            <TableCell align="right">Users</TableCell>
            <TableCell align="right">Sessions</TableCell>
            <TableCell align="right">Bounce Rate</TableCell>
            <TableCell align="right">Avg. Session Duration</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trafficData.map((row) => (
            <TableRow key={row.source}>
              <TableCell component="th" scope="row">
                {row.source}
              </TableCell>
              <TableCell align="right">{row.users}</TableCell>
              <TableCell align="right">{row.sessions}</TableCell>
              <TableCell
                align="right"
                className={
                  row.bounceRate.includes("63%")
                    ? "text-red-500"
                    : "text-green-500"
                }
              >
                {row.bounceRate}
              </TableCell>
              <TableCell align="right">{row.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LatestAccidents;
