import React from "react";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AboutPage: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "transparent",
        backgroundImage: `
          linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0)),
          url('./assets/background2.png')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "Courier New, monospace",
        color: "#00ff00",
      }}
    >
      {/* Sidebar Navigation */}
      <Box
  sx={{
    position: { xs: "relative", md: "sticky" },
    width: { xs: "100%", md: "200px" },
    height: { xs: "auto", md: "100vh" },
    padding: "16px",
  }}
>
        <Typography variant="h6" sx={{ marginBottom: "16px", textAlign: "center" }}>
          Navigation
        </Typography>
        <List>
          <ListItem button component="a" href="#about">
            <ListItemText primary="About Omnia" />
          </ListItem>
          <ListItem button component="a" href="#how-it-works">
            <ListItemText primary="How It Works" />
          </ListItem>
          <ListItem button component="a" href="#what-you-can-do">
            <ListItemText primary="What You Can Do" />
          </ListItem>
          <ListItem button component="a" href="#vision">
            <ListItemText primary="Vision" />
          </ListItem>
          <ListItem button component="a" href="#faq">
            <ListItemText primary="FAQ" />
          </ListItem>
        </List>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          padding: "16px",
        }}
      >
        <Typography id="about" variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
          Welcome to Omnia
        </Typography>
        <Typography sx={{ marginBottom: "40px", textAlign: "center" }}>
          Gamify your path to sustainability. Stake cards, earn rewards, and build a better future.
        </Typography>

        {/* About Section */}
        <Box id="about" sx={{ marginBottom: "40px" }}>
          <Typography variant="h5" sx={{ marginBottom: "20px", textAlign: "center" }}>
            About Omnia
          </Typography>
          <Typography>
            Omnia is a platform where technology meets sustainability. By staking cards with unique
            attributes, you earn rewards while contributing to a growing ecosystem.
          </Typography>
        </Box>

        {/* How It Works Section */}
        <Box id="how-it-works" sx={{ marginBottom: "40px" }}>
          <Typography variant="h5" sx={{ marginBottom: "20px", textAlign: "center" }}>
            How It Works
          </Typography>
          <Typography>{`- Stake cards to earn rewards over time.`}</Typography>
          <Typography>{`- Unlock future benefits like mapping tools and resource marketplaces.`}</Typography>
        </Box>

        {/* What You Can Do Section */}
        <Box id="what-you-can-do" sx={{ marginBottom: "40px" }}>
          <Typography variant="h5" sx={{ marginBottom: "20px", textAlign: "center" }}>
            What You Can Do Today
          </Typography>
          <Typography>{`- Stake cards to start earning points.`}</Typography>
          <Typography>{`- Prepare for future features like tokenized marketplaces and workshops.`}</Typography>
        </Box>

        {/* Vision Section */}
        <Box id="vision" sx={{ marginBottom: "40px" }}>
          <Typography variant="h5" sx={{ marginBottom: "20px", textAlign: "center" }}>
            The Vision for Omnia
          </Typography>
          <Typography>
            Omnia will evolve into a platform that connects real-world actions with technology,
            empowering individuals to create a positive environmental impact.
          </Typography>
        </Box>

        {/* FAQ Section */}
        <Box id="faq" sx={{ marginBottom: "40px" }}>
          <Typography variant="h5" sx={{ marginBottom: "20px", textAlign: "center" }}>
            Frequently Asked Questions
          </Typography>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>What is Omnia?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Omnia is a gamified platform that integrates sustainability with technology,
                encouraging users to earn rewards while supporting the ecosystem.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>How do I stake cards?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Visit the Token Management page to stake your cards.</Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutPage;
