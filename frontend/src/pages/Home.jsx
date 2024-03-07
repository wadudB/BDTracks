import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Typography,
  Box,
  Unstable_Grid2 as Grid2,
  Divider,
} from "@mui/material";
import AboutUs from "../components/AboutUS";
import FeatureCard from "../components/FeatureCard";
import ContactForm from "../components/ContactForm ";
const Home = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [typedText, setTypedText] = useState("");
  const textToType = "BDTracks";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < textToType.length) {
        setTypedText(textToType.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [textToType]);

  return (
    <Box sx={{ mx: "auto", maxWidth: isSmallScreen ? "92%" : "85%" }}>
      <Grid2
        sx={{
          height: "90vh",
          backgroundImage: "url(/home2.png)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: 2,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: {
              xs: "1.5rem",
              sm: "2rem",
              md: "2.5rem",
              lg: "3rem",
            },
            color: "#CBD5E1",
            textAlign: "justify",
            width: "100%",

            whiteSpace: {
              xs: "nowrap",
              sm: "nowrap",
              md: "pre-wrap",
              lg: "pre-wrap",
            },
          }}
        >
          {`Welcome to ${!isSmallScreen ? "\n" : ""}${typedText}`}
        </Typography>
        <Typography
          sx={{
            width: {
              xs: "100%",
              sm: "88%",
              md: "75%",
              lg: "40%",
              xl: "40%",
            },
            color: "#CBD5E1",
            mt: 2,
            textAlign: "justify",
          }}
        >
          Your comprehensive platform for tracking vital statistics and trends
          in Bangladesh. Our mission is to leverage advanced AI technologies,
          including the GPT-4 Turbo model, to provide real-time insights and
          analytics on various aspects of daily life in Bangladesh.
        </Typography>
      </Grid2>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          color="#CBD5E1"
          sx={{
            fontSize: {
              xs: "1.88rem",
              sm: "1.88rem",
              md: "2.125rem",
            },
            mb: 2,
            textAlign: "center",
          }}
        >
          Key Features
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 xs={12} md={6}>
            <FeatureCard
              icon="/accident.svg"
              title="Road Accident Tracker"
              description="Our dashboard offers an up-to-date overview of road accidents, including total accidents, fatalities, and injuries. 
              We meticulously compile data from daily newspaper articles to present a clear picture of road safety in the country."
              url="/road-accident-dashboard"
            />
          </Grid2>

          <Grid2 xs={12} md={6}>
            <FeatureCard
              icon="/esurvey.svg"
              title="Election Vote Survey"
              description=" Engage in the democratic process with our online survey platform, 
              where you can cast your vote and see the preferences of the populace in real-time."
              url="/election-survey"
            />
          </Grid2>
          <Grid2 xs={12} md={6}>
            <FeatureCard
              icon="/commodity.svg"
              title="Commodity Price Tracker"
              description="Stay informed about the latest market trends with our commodity price tracker. 
              Users can contribute by updating prices, ensuring that the information is current and accurate."
            />
          </Grid2>
          <Grid2 xs={12} md={6}>
            <FeatureCard
              icon="/outage.svg"
              title="National Outage Detector"
              description="Our upcoming feature will provide real-time updates on power outages across the country, helping you stay prepared and informed."
            />
          </Grid2>

          <Grid2 xs={12} md={6}>
            <FeatureCard
              icon="pv.svg"
              title="Photovoltaic System Design Calculator"
              description="Discover the potential of solar energy for your needs with our Photovoltaic System Design Calculator. 
              This tool is designed to help you estimate the feasibility and costs of implementing a photovoltaic system for your home or business. 
              By inputting basic information about your energy requirements and location, our calculator can provide you with an approximate cost analysis and system size recommendation, empowering you to make informed decisions about adopting renewable energy solutions."
            />
          </Grid2>
          <Grid2 xs={12} md={6}>
            <FeatureCard
              icon="forecast.svg"
              title="Weather Forecast and Numerical Modeling"
              description="Stay ahead of the weather with our advanced Weather Forecast and Numerical Modeling service. 
              Utilizing cutting-edge AI models like Google DeepMind's Graphcast, we plan to provide accurate and localized weather predictions for Bangladesh. Our platform is designed to help individuals, businesses, and researchers access reliable weather data, enabling better planning and decision-making in the face of changing weather patterns."
            />
          </Grid2>
          <Grid2 xs={12}>
            <FeatureCard
              icon="/ecalculator.svg"
              title="Energy Cost Calculator"
              description="Plan, validate and manage your energy expenses with our easy-to-use calculator, designed to give you an estimate of your monthly energy bills."
            />
          </Grid2>
        </Grid2>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          color="#CBD5E1"
          sx={{
            fontSize: {
              xs: "1.88rem",
              sm: "1.88rem",
              md: "2.125rem",
            },
            mt: 3,
            textAlign: "center",
          }}
        >
          About Us
        </Typography>
        <AboutUs
          imageSrc="/aboutus.svg"
          title=""
          description="At BDTracks, we are a team of dedicated freelancers committed to
         bringing transparency and efficiency to information tracking in
         Bangladesh. Our platform is constantly evolving, with new features and
         improvements aimed at serving the needs of our users and contributing
         to the betterment of our society."
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#CBD5E1",
            fontSize: {
              xs: "1.88rem",
              sm: "1.88rem",
              md: "2.125rem",
            },
            mt: 3,
            mb: 2,
            textAlign: "center",
          }}
        >
          Contact
        </Typography>
        <Typography variant="body1" sx={{ color: "#CBD5E1", mb: 5 }}>
          Get In Touch With Us
        </Typography>

        <ContactForm />
      </Box>
      <div className="my-5">
        <Divider variant="fullwidth" sx={{ borderColor: "#CBD5E1" }} />
      </div>
    </Box>
  );
};

export default Home;
