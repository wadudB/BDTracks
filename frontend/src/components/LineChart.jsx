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
import { subDays, format } from "date-fns";

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

const LineChart = ({ accidentData }) => {
  // Calculate the date 30 days ago
  const thirtyDaysAgo = format(subDays(new Date(), 30), "yyyy-MM-dd");

  // Filter data for the last 30 days
  const filteredData = accidentData.filter(({ accident_datetime_from_url }) => {
    const date = accident_datetime_from_url.split(" ")[0];
    return date >= thirtyDaysAgo;
  });

  // Process data to sum deaths and injuries per day
  const deathCounts = {};
  const injuryCounts = {};
  filteredData.forEach(
    ({
      accident_datetime_from_url,
      total_number_of_people_killed,
      total_number_of_people_injured,
    }) => {
      const date = accident_datetime_from_url.split(" ")[0];
      deathCounts[date] =
        (deathCounts[date] || 0) +
        parseFloat(total_number_of_people_killed || 0);
      injuryCounts[date] =
        (injuryCounts[date] || 0) +
        parseFloat(total_number_of_people_injured || 0);
    }
  );

  const dates = Object.keys({ ...deathCounts, ...injuryCounts }).sort();
  const deaths = dates.map((date) => deathCounts[date] || 0);
  const injuries = dates.map((date) => injuryCounts[date] || 0);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Total Deaths",
        data: deaths,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderWidth: 1,
        fill: false,
      },
      {
        label: "Total Injuries",
        data: injuries,
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
  accidentData: PropTypes.arrayOf(
    PropTypes.shape({
      accident_datetime_from_url: PropTypes.string.isRequired,
      total_number_of_people_killed: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      total_number_of_people_injured: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    })
  ).isRequired,
};
export default LineChart;
