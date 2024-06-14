import { Paper, Typography, Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";

const FeaturePaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.primary,
  background: "#061434",
  borderRadius: "8px",
  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
  height: "100%",
}));

// Box container
const FeatureIconContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "1rem",
});

const FeatureIcon = styled("img")({
  maxWidth: "100%",
  height: "auto",
  maxHeight: "100px",
});

const FeatureButton = styled(Button)(({ theme }) => ({
  marginTop: "1rem",
  color: theme.palette.text.primary,
  borderColor: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.text.highlight,
    color: "#000000",
  },
  "&:disabled": {
    // Disabled state
    color: "grey",
  },
}));

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

// PropTypes
FeatureCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string,
};
export default FeatureCard;
