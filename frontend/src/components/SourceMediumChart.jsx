import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const pieData = {
  labels: ["Social", "Search Engines", "Direct"],
  datasets: [
    {
      data: [260, 125, 164], // Values for each segment
      backgroundColor: ["#f70808", "#1258e5", "#e2a218"],
      borderWidth: 0, // Set border width to 0 for seamless segments
      hoverOffset: 4,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "80%", // Adjust for desired doughnut thickness
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed !== null) {
            label += new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(context.parsed);
          }
          return label;
        },
      },
    },
    // title: {
    //   display: true,
    //   text: "+23% new visitors",
    //   position: "bottom",
    //   color: "white",
    //   font: {
    //     size: 16,
    //   },
    // },
  },
  // Additional customization...
};

const SourceMediumChart = () => {
  return (
    <div style={{ position: "relative", height: "350px", width: "100%" }}>
      <Doughnut data={pieData} options={options} />
      {/* Add custom components for additional design elements here */}
    </div>
  );
};

export default SourceMediumChart;
