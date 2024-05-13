import { Line } from "react-chartjs-2";
import PropTypes from "prop-types";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const LineChart = ({ dailyDeathsData, dailyInjuredData }) => {
  const dates = Object.keys(dailyDeathsData);
  const deathValues = Object.values(dailyDeathsData);
  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Total Deaths",
        data: deathValues,
        borderColor: "#771717",
        backgroundColor: " #771717",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Total Injuries",
        data: dailyInjuredData,
        borderColor: "#CD7F32",
        backgroundColor: "#CD7F32",
        borderWidth: 2,
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "yyyy-MM-dd",
          displayFormats: {
            day: "MM/dd",
          },
        },
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          autoSkipPadding: 15,
          source: "auto",
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label;
            const value = context.parsed.y;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: "300px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

// PropTypes
LineChart.propTypes = {
  dailyDeathsData: PropTypes.any,
  dailyInjuredData: PropTypes.any,
};
export default LineChart;
