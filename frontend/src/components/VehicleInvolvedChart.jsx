import { useMemo, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

const VehicleInvolvedChart = ({ vehiclesInvolved, slideIndex, maxValue }) => {
  const [width] = useWindowSize();
  const rowsPerSlide = 18;
  const startRow = slideIndex * rowsPerSlide;
  const endRow = startRow + rowsPerSlide;

  const vehicleData = useMemo(() => {
    const vehicleEntries = Object.entries(vehiclesInvolved);
    vehicleEntries.sort((a, b) => b[1] - a[1]);
    const vehicleName = vehicleEntries.map((entry) => entry[0]);
    const vehicleCount = vehicleEntries.map((entry) => entry[1]);
    const slicedVehicleName = vehicleName.slice(startRow, endRow);
    const slicedVehicleCount = vehicleCount.slice(startRow, endRow);

    return {
      labels: slicedVehicleName,
      datasets: [
        {
          data: slicedVehicleCount,
          backgroundColor: [
            "rgba(220, 20, 60, 0.5)", // Crimson
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
            "rgba(255, 159, 64, 0.5)",
            "rgba(255, 99, 71, 0.5)", // Tomato
            "rgba(60, 179, 113, 0.5)", // Medium Sea Green
            "rgba(70, 130, 180, 0.5)", // Steel Blue
            "rgba(240, 128, 128, 0.5)", // Light Coral
            "rgba(32, 178, 170, 0.5)", // Light Sea Green
            "rgba(219, 112, 147, 0.5)", // Pale Violet Red
            "rgba(255, 215, 0, 0.5)", // Gold
            "rgba(64, 224, 208, 0.5)", // Turquoise
            "rgba(95, 158, 160, 0.5)", // Cadet Blue
            "rgba(72, 61, 139, 0.5)", // Dark Slate Blue
            "rgba(255, 165, 0, 0.5)", // Orange
          ],
          hoverBackgroundColor: [
            "rgba(220, 20, 60, 1)", // Crimson
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(255, 99, 71, 1)", // Tomato
            "rgba(60, 179, 113, 1)", // Medium Sea Green
            "rgba(70, 130, 180, 1)", // Steel Blue
            "rgba(240, 128, 128, 1)", // Light Coral
            "rgba(32, 178, 170, 1)", // Light Sea Green
            "rgba(219, 112, 147, 1)", // Pale Violet Red
            "rgba(255, 215, 0, 1)", // Gold
            "rgba(64, 224, 208, 1)", // Turquoise
            "rgba(95, 158, 160, 1)", // Cadet Blue
            "rgba(72, 61, 139, 1)", // Dark Slate Blue
            "rgba(255, 165, 0, 1)", // Orange
          ],
        },
      ],
    };
  }, [vehiclesInvolved, startRow, endRow]);

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
      scales: {
        x: {
          max: maxValue,
        },
      },
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
    [maxValue]
  );

  // Adjust the style based on the window size
  const chartStyle = {
    height: width < 600 ? "600px" : "600px",
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
  slideIndex: PropTypes.number,
  maxValue: PropTypes.number.isRequired,
};

const ChartCarousel = ({ vehiclesInvolved }) => {
  const totalRows = Object.keys(vehiclesInvolved).length;
  const numSlides = Math.ceil(totalRows / 18);
  const maxValue = Math.max(...Object.values(vehiclesInvolved));

  const sliderSettings = {
    dots: true, // Enable bottom dots
    arrows: false, // Disable left and right arrows
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: (dots) => (
      <div style={{ bottom: "-6px", fill: "white !important" }}>{dots}</div>
    ),
  };

  return (
    <Slider {...sliderSettings}>
      {Array.from({ length: numSlides }).map((_, index) => (
        <div key={index}>
          <VehicleInvolvedChart
            vehiclesInvolved={vehiclesInvolved}
            slideIndex={index}
            maxValue={maxValue}
          />
        </div>
      ))}
    </Slider>
  );
};

ChartCarousel.propTypes = {
  vehiclesInvolved: PropTypes.objectOf(PropTypes.number),
};

export default ChartCarousel;
