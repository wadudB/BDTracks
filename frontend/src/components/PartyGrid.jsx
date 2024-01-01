import "leaflet/dist/leaflet.css";
import "../css/leaflet.css";
import { Bar } from "react-chartjs-2";
import "leaflet-boundary-canvas";
import PropTypes from "prop-types";

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
const PartyGrid = ({ leadingParties }) => {
  // Initialize a tally object to count constituency wins
  const partiesArray = Object.values(leadingParties);
  const constituencyWinsByParty =
    partiesArray?.reduce((accumulator, { Party }) => {
      if (Party) {
        // Check if the Party value is not null or undefined
        const existingParty = accumulator.find((item) => item.party === Party);
        if (existingParty) {
          existingParty.count += 1;
        } else {
          accumulator.push({ party: Party, count: 1 });
        }
      }
      return accumulator;
    }, []) || [];

  // console.log("constituencyWinsByParty", constituencyWinsByParty);

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

          // Retrieve the party name from the dataset
          const partyName = dataset.party;

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

  const colors = ["#006a4e", "#F6F600", "#DCDCDC"];

  const datasets = constituencyWinsByParty.map((item, index) => ({
    label: item.party,
    data: [item.count], // Use the 'count' property from the object
    backgroundColor: colors[index % colors.length],
    party: item.party,
  }));

  const data = {
    labels: ["Constituency"],
    datasets,
  };

  return (
    <Bar options={options} data={data} height="30%" plugins={[barTextPlugin]} />
  );
};

PartyGrid.propTypes = {
  leadingParties: PropTypes.object.isRequired, // Change the type to match your prop's type
};

export default PartyGrid;
