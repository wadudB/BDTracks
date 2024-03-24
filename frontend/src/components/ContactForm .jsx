import { useState } from "react";
import { Grid, TextField, Button, Box, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    // Reset form fields
    setFormData({ name: "", email: "", message: "" });
  };

  const WhiteTextField = styled(TextField)({
    "& label": {
      color: "grey",
    },
    "& .MuiInputBase-input": {
      color: "white",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "grey",
      },
      "&:hover fieldset": {
        borderColor: "grey",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#c77676",
      },
    },
  });

  // Styled button with hover color change
  const WhiteButton = styled(Button)({
    color: "#CBD5E1",
    borderColor: "#CBD5E1",
    "&:hover": {
      backgroundColor: "#c77676",
      color: "#000000",
    },
  });

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const formPadding = isSmallScreen ? 12 : 0;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Box px={formPadding}>
          <form onSubmit={handleSubmit}>
            <Grid item xs={12}>
              <WhiteTextField
                halfWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            {/* Email field */}
            <Grid item xs={12}>
              <WhiteTextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            {/* Message field */}
            <WhiteTextField
              fullWidth
              label="Message"
              name="message"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange}
              margin="normal"
            />
            {/* Submit button */}
            <WhiteButton variant="contained" type="submit" fullWidth>
              Submit
            </WhiteButton>
          </form>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box
          component="img"
          src="/3969584.svg"
          alt="Contact Us"
          sx={{
            width: "100%",
            height: "auto",
            maxWidth: "400px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ContactForm;
