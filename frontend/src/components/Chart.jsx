import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Death" fill="#8884d8" />
        <Bar dataKey="Injured" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;
