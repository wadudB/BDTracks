import { Paper, Typography, Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types"; // Import PropTypes

const FeaturePaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  textAlign: "center",
  color: "#CBD5E1",
  background: "#061434",
  borderRadius: "8px",
  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
  height: "100%",
}));

// Updated to style a Box container for centering the image
const FeatureIconContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "1rem", // Adds some space below the icon
});

const FeatureIcon = styled("img")({
  maxWidth: "100%",
  height: "auto",
  maxHeight: "100px",
});

const FeatureButton = styled(Button)({
  marginTop: "1rem",
  color: "#CBD5E1",
  borderColor: "#CBD5E1",
  "&:hover": {
    backgroundColor: "#c77676",
    color: "#000000",
  },
  "&:disabled": {
    color: "grey", // Ensure disabled state has white text
  },
});

const FeatureCard = ({ icon, title, description, url }) => {
  // Determine the button label and whether it acts as a link based on `url`
  const buttonLabel = url ? "VIEW" : "COMING SOON";
  const buttonProps = url
    ? {
        component: "a",
        href: url,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <FeaturePaper elevation={3}>
      <FeatureIconContainer>
        <FeatureIcon src={icon} alt="Feature icon" />
      </FeatureIconContainer>
      <Typography variant="h5" component="h3" gutterBottom>
        {title}
      </Typography>
      <Typography variant="subtitle2">{description}</Typography>
      <FeatureButton variant="outlined" {...buttonProps} disabled={!url}>
        {buttonLabel}
      </FeatureButton>
    </FeaturePaper>
  );
};
FeatureCard.propTypes = {
  icon: PropTypes.string.isRequired, // Specifies that icon is a required string
  title: PropTypes.string.isRequired, // Specifies that title is a required string
  description: PropTypes.string.isRequired, // Specifies that description is a required string
  url: PropTypes.string, // Specifies that url is an optional string
};
export default FeatureCard;
