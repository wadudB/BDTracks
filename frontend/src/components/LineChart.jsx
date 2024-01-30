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
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderWidth: 1,
        fill: false,
      },
      {
        label: "Total Injuries",
        data: dailyInjuredData,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
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

LineChart.propTypes = {
  dailyDeathsData: PropTypes.any,
  dailyInjuredData: PropTypes.any,
};
export default LineChart;
