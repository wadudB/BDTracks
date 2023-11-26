import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Dummy data for the pie chart
const pieData = [
  { name: "Social", value: 260, fill: "#8884d8" },
  { name: "Search Engines", value: 125, fill: "#83a6ed" },
  { name: "Direct", value: 164, fill: "#8dd1e1" },
  // Add more sources as needed
];

// Component for the Pie Chart
const SourceMediumChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie data={pieData} innerRadius={60} outerRadius={80} dataKey="value">
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.fill} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export default SourceMediumChart;
