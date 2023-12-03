import { useMemo, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import PropTypes from "prop-types";

// Custom hook to listen to window resize events
const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

const VehicleInvolvedChart = ({ vehiclesInvolved }) => {
  const [width] = useWindowSize();

  const vehicleData = useMemo(() => {
    const vehicleEntries = Object.entries(vehiclesInvolved);
    vehicleEntries.sort((a, b) => b[1] - a[1]);
    const vehicleName = vehicleEntries.map((entry) => entry[0]);
    const vehicleCount = vehicleEntries.map((entry) => entry[1]);

    return {
      labels: vehicleName,
      datasets: [
        {
          data: vehicleCount,
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
            "rgba(255, 159, 64, 0.5)",
          ],
          hoverBackgroundColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
        },
      ],
    };
  }, [vehiclesInvolved]);

  const options = useMemo(
    () => ({
      indexAxis: "y",
      maintainAspectRatio: false,
      elements: {
        bar: {
          borderWidth: 1,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Vehicle Involvement in Accidents",
          position: "bottom",
          color: "white",
        },
      },
    }),
    []
  );

  // Adjust the style based on the window size
  const chartStyle = {
    height: width < 600 ? "400px" : "400px",
    width: "100%",
  };

  return (
    <div>
      <Bar style={chartStyle} data={vehicleData} options={options} />
    </div>
  );
};

VehicleInvolvedChart.propTypes = {
  vehiclesInvolved: PropTypes.objectOf(PropTypes.number),
};

export default VehicleInvolvedChart;
