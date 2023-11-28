import PropTypes from "prop-types";
import { Paper, Typography } from "@mui/material";

const DashboardPaper = ({
  children,
  title,
  statistic,
  statisticNote,
  ...props
}) => {
  return (
    <Paper
      className="p-4 flex flex-col justify-between h-full dashboard-paper"
      style={{
        backgroundColor: "#202940",
        borderRadius: "8px",
        color: "white",
      }}
      {...props}
    >
      {title && <Typography variant="subtitle2">{title}</Typography>}
      {statistic && (
        <Typography variant="h5" className="font-bold">
          {statistic}
        </Typography>
      )}
      {statisticNote && (
        <Typography variant="body2" className="text-green-500">
          {statisticNote}
        </Typography>
      )}
      {children}
    </Paper>
  );
};

// Define propTypes for the component
DashboardPaper.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  statistic: PropTypes.string,
  statisticNote: PropTypes.string,
};

export default DashboardPaper;
