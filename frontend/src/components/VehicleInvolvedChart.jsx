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

const VehicleInvolvedChart = ({ vehiclesInvolved, slideIndex }) => {
  const [width] = useWindowSize();
  const rowsPerSlide = 15;
  const startRow = slideIndex * rowsPerSlide;
  const endRow = startRow + rowsPerSlide;

  const vehicleData = useMemo(() => {
    const vehicleEntries = Object.entries(vehiclesInvolved);
    vehicleEntries.sort((a, b) => b[1] - a[1]);
    const vehicleName = vehicleEntries.map((entry) => entry[0]);
    const vehicleCount = vehicleEntries.map((entry) => entry[1]);

    // Slice the data to show only 'rowsToShow' number of rows
    // Slice the data based on the slide index
    const slicedVehicleName = vehicleName.slice(startRow, endRow);
    const slicedVehicleCount = vehicleCount.slice(startRow, endRow);

    return {
      labels: slicedVehicleName,
      datasets: [
        {
          data: slicedVehicleCount,
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
  }, [vehiclesInvolved, startRow, endRow]); // Add dependencies here

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
  slideIndex: PropTypes.number, // Add propType for slideIndex
};

// Carousel component that displays 10 rows of the chart per slide
const ChartCarousel = ({ vehiclesInvolved }) => {
  const totalRows = Object.keys(vehiclesInvolved).length;
  const numSlides = Math.ceil(totalRows / 15);

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
            slideIndex={index} // Pass the slide index here
            rowsToShow={10}
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
