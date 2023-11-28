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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const data = [
  { name: "Jan", Death: 4000, Injured: 2400 },
  { name: "Feb", Death: 3000, Injured: 1398 },
  { name: "Mar", Death: 2000, Injured: 9800 },
  { name: "Apr", Death: 2780, Injured: 3908 },
  { name: "May", Death: 1890, Injured: 4800 },
  { name: "Jun", Death: 2390, Injured: 3800 },
  { name: "Jul", Death: 3490, Injured: 4300 },
  // ... add more months as needed
];

const Chart = () => {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: "Death",
        data: data.map((item) => item.Death),
        backgroundColor: "rgba(136, 132, 216, 0.5)",
        borderColor: "rgba(136, 132, 216, 1)",
        borderWidth: 1,
      },
      {
        label: "Injured",
        data: data.map((item) => item.Injured),
        backgroundColor: "rgba(130, 202, 157, 0.5)",
        borderColor: "rgba(130, 202, 157, 1)",
        borderWidth: 1,
      },
    ],
  };

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

export default Chart;
