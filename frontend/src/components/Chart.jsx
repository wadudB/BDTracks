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
import { parseISO, format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ accidentData, viewMode }) => {
  const chartData = useMemo(() => {
    const aggregateData = {};
    const monthOrder = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      May: 5,
      Jun: 6,
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12,
    };

    accidentData.forEach((item) => {
      const date = parseISO(item.accident_datetime_from_url);
      const key =
        viewMode === "yearly" ? format(date, "yyyy") : format(date, "MMM");

      if (!aggregateData[key]) {
        aggregateData[key] = { Death: 0, Injured: 0 };
      }

      aggregateData[key].Death +=
        parseInt(item.total_number_of_people_killed, 10) || 0;
      aggregateData[key].Injured +=
        parseInt(item.total_number_of_people_injured, 10) || 0;
    });

    const labels = Object.keys(aggregateData).sort(
      (a, b) => monthOrder[a] - monthOrder[b]
    );
    const deathData = labels.map((key) => aggregateData[key].Death);
    const injuredData = labels.map((key) => aggregateData[key].Injured);

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
  }, [accidentData, viewMode]);

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
  viewMode: PropTypes.oneOf(["monthly", "yearly"]).isRequired,
};

export default Chart;
