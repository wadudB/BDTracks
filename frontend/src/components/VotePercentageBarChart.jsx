import React from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VotePercentageBarChart = React.memo(
  ({ votePercentages, isSmallScreen }) => {
    // Calculate the total votes
    const totalVotes = votePercentages.reduce(
      (acc, candidate) => acc + candidate.Votes,
      0
    );

    const options = {
      indexAxis: "y",
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        datalabels: {
          display: true,
          color: "white",
          anchor: "end",
          align: "start",
          offset: -10,
          formatter: (value, context) => {
            return context.chart.data.labels[context.dataIndex];
          },
        },
        tooltip: {
          // Customizing tooltip
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed.x !== null) {
                label += context.parsed.x + "%";
              }
              return label;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          display: false,
          max: 100,
          ticks: {
            callback: function (value) {
              return `${value}%`;
            },
          },
        },
        y: {
          stacked: true,
          display: false,
        },
      },
    };
    const barTextPlugin = {
      id: "barTextPlugin",
      afterDatasetsDraw(chart) {
        const ctx = chart.ctx;
        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          meta.data.forEach((bar) => {
            // Set the text styling
            ctx.fillStyle = "black";
            const fontSize = 14;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `${fontSize}px Arial`;

            // Retrieve the party name from the dataset
            const partyName = dataset.label;

            // For horizontal centering, use the center of the bar's width
            const xPos = bar.getCenterPoint().x;

            // For vertical centering, use the center of the bar's height
            const yPos = bar.getCenterPoint().y;

            // Draw the text if there's enough room within the bar
            if (bar.width > ctx.measureText(partyName).width) {
              ctx.fillText(partyName, xPos, yPos);
            }
          });
        });
      },
    };

    const datasets = votePercentages.map((item) => ({
      label: item.Party,
      data: [((item.Votes / totalVotes) * 100).toFixed(2)],
      backgroundColor: item.color,
      // party: item.Party,
    }));

    const data = {
      labels: ["Winning Projection"],
      datasets,
    };

    return (
      <Bar
        options={options}
        data={data}
        height={isSmallScreen ? "50%" : "30%"}
        plugins={[barTextPlugin]}
      />
    );
  }
);

VotePercentageBarChart.displayName = "VotePercentageBarChart";

// prop types validation for votePercentages
VotePercentageBarChart.propTypes = {
  votePercentages: PropTypes.arrayOf(
    PropTypes.shape({
      CandidateName: PropTypes.string.isRequired,
      Votes: PropTypes.number.isRequired,
      Party: PropTypes.string.isRequired,
    })
  ).isRequired,
  isSmallScreen: PropTypes.bool.isRequired,
};

export default VotePercentageBarChart;
