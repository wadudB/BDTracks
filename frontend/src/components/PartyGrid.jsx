import "leaflet/dist/leaflet.css";
import "../css/leaflet.css";
import { Bar } from "react-chartjs-2";
import "leaflet-boundary-canvas";
import PropTypes from "prop-types";
import React from "react";

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

const PartyGrid = React.memo(({ leadingParties, isSmallScreen }) => {
  const partiesArray = Object.values(leadingParties);
  const constituencyWinsByParty = partiesArray.reduce(
    (accumulator, { Party, Color, PartyName }) => {
      if (Party) {
        if (!accumulator[Party]) {
          accumulator[Party] = { count: 0, color: Color, partyName: PartyName };
        }
        accumulator[Party].count += 1;
      }
      return accumulator;
    },
    {}
  );

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          title: function () {
            return "";
          },
        },
      },
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
    },
    scales: {
      x: {
        stacked: true,
        display: false,
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

          const partyName = dataset.party;

          // Horizontal centering (bar's width)
          const xPos = bar.getCenterPoint().x;

          // Vertical centering (bar's height)
          const yPos = bar.getCenterPoint().y;

          // Draw text if there's enough room within the bar
          if (bar.width > ctx.measureText(partyName).width) {
            ctx.fillText(partyName, xPos, yPos);
          }
        });
      });
    },
  };
  const datasets = Object.keys(constituencyWinsByParty).map((party) => ({
    label: [constituencyWinsByParty[party].partyName],
    data: [constituencyWinsByParty[party].count],
    backgroundColor: constituencyWinsByParty[party].color,
    party: party,
  }));

  const data = {
    labels: ["Constituency"],
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
});

// PropTypes
PartyGrid.displayName = "PartyGrid";
PartyGrid.propTypes = {
  leadingParties: PropTypes.object.isRequired,
  isSmallScreen: PropTypes.bool.isRequired,
};

export default PartyGrid;
