import React from "react";
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./AboutPage.css";

const AboutPage: React.FC = () => {
  return (
    <Box className="about-page">
      {/* Hero Section */}
      <Box className="hero">
        <Typography variant="h1">Welcome to Omnia</Typography>
        <Typography>
          Gamify your path to sustainability. Stake cards, earn rewards, and build a better future.
        </Typography>
      </Box>

      {/* About Section */}
      <section>
        <Typography variant="h2">About Omnia</Typography>
        <Typography>
          Omnia is your gateway to a sustainable future through gamified experiences. Stake cards, earn
          rewards, and contribute to a thriving ecosystem—all while making a positive impact on the
          planet.
        </Typography>
      </section>

      {/* How It Works Section */}
      <section>
        <Typography variant="h2">How It Works</Typography>
        <ul>
          <li>Stake cards with unique attributes to earn rewards over time.</li>
          <li>Collect points, tokens, and valuable resources as you engage with the platform.</li>
          <li>Unlock future benefits, including mapping tools, resource marketplaces, and tokenized workshops.</li>
        </ul>
      </section>

      {/* What You Can Do Today Section */}
      <section>
        <Typography variant="h2">What You Can Do Today</Typography>
        <ul>
          <li>Stake your cards now to start earning points and contributing to the ecosystem.</li>
          <li>Prepare for exciting upcoming features like tokenized marketplaces and educational workshops.</li>
        </ul>
      </section>

      {/* Vision Section */}
      <section>
        <Typography variant="h2">The Vision for Omnia</Typography>
        <Typography>
          Omnia envisions a world where every individual can make a tangible difference for the
          environment. Our platform bridges the gap between technology and real-world action, enabling
          users to regenerate ecosystems, track progress, and foster a global community dedicated to
          sustainability.
        </Typography>
      </section>

      {/* FAQ Section */}
      <section>
        <Typography variant="h2">Frequently Asked Questions</Typography>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>What is Omnia?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Omnia is a gamified platform that integrates sustainability with technology. By staking
              cards, users earn rewards while supporting an ecosystem designed to drive real-world
              environmental impact.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How do I stake cards?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Visit the Token Management page to stake your cards and begin earning rewards today.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </section>
    </Box>
  );
};

export default AboutPage;
