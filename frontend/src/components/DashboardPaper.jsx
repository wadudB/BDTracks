import PropTypes from "prop-types";
import { Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const DashboardPaper = ({
  children,
  title,
  statistic,
  statisticNote,
  ...props
}) => {
  const theme = useTheme();
  return (
    <Paper
      className="p-4 flex flex-col justify-between h-full dashboard-paper"
      style={{
        backgroundColor: "#061434",
        borderRadius: "8px",
        color: theme.palette.text.primary,
        justifyContent: "center",
      }}
      {...props}
    >
      {statistic && (
        <Typography variant="h5" className="font-bold text-green-500 pb-5">
          {statistic}
        </Typography>
      )}
      {title && <Typography variant="subtitle1">{title}</Typography>}
      {statisticNote && (
        <Typography variant="body2" className="text-green-500">
          {statisticNote}
        </Typography>
      )}
      {children}
    </Paper>
  );
};

// PropTypes
DashboardPaper.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  statistic: PropTypes.string,
  statisticNote: PropTypes.string,
};

export default DashboardPaper;
