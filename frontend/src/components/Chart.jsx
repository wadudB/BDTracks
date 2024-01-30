import { useMemo } from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ monthlyInjured, monthlyDeaths, accidentData, viewMode }) => {
  const chartData = useMemo(() => {
    let labels, deathData, injuredData;

    if (viewMode === "yearly") {
      // Yearly data logic
      const yearlyData = accidentData
        .map((data) => ({
          year: data.year,
          totalKilled: data.total_killed,
          totalInjured: data.total_injured,
        }))
        .sort((a, b) => a.year - b.year); // Sort based on year

      labels = yearlyData.map((data) => data.year.toString());
      deathData = yearlyData.map((data) => data.totalKilled);
      injuredData = yearlyData.map((data) => data.totalInjured);
    } else {
      // Monthly data logic
      const sortedMonths = Object.keys(monthlyDeaths).sort(
        (a, b) => new Date(a) - new Date(b)
      ); // Sort based on month
      labels = sortedMonths.map((month) => {
        const date = new Date(month);
        return date.toLocaleString("default", {
          month: "short",
        });
      });
      deathData = sortedMonths.map((month) => monthlyDeaths[month]);
      injuredData = sortedMonths.map((month) => monthlyInjured[month]);
    }

    // Common dataset configuration
    return {
      labels,
      datasets: [
        {
          label: "Total Deaths",
          data: deathData,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
        {
          label: "Total Injuries",
          data: injuredData,
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [monthlyInjured, monthlyDeaths, accidentData, viewMode]);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: "300px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

Chart.propTypes = {
  monthlyInjured: PropTypes.object.isRequired,
  monthlyDeaths: PropTypes.object.isRequired,
  accidentData: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      total_killed: PropTypes.number.isRequired,
      total_injured: PropTypes.number.isRequired,
    })
  ).isRequired,
  viewMode: PropTypes.oneOf(["monthly", "yearly"]).isRequired,
};

export default Chart;
