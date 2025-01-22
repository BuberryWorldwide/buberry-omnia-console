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
        <Typography variant="subtitle1">
          Gamify your sustainability journey. Together, let’s empower communities, regenerate ecosystems, and inspire change.
        </Typography>
      </Box>

      {/* About Section */}
      <section>
        <Typography variant="h2">What is Omnia?</Typography>
        <Typography>
          Omnia is the interactive, gamified foundation of Buberry Worldwide's mission to create a self-sustaining, eco-conscious future. 
          By integrating blockchain technology, NFT staking, and real-world ecological impact metrics, Omnia transforms individual actions into collective progress. 
          Stake cards, earn rewards, and directly contribute to initiatives like carbon sequestration, soil regeneration, and biodiversity preservation.
        </Typography>
      </section>

      {/* How Omnia Works */}
      <section>
        <Typography variant="h2">How Omnia Works</Typography>
        <ul>
          <li>
            <strong>Stake NFT Cards:</strong> Participate in ecological projects by staking cards with unique attributes. These cards represent tools, land, plants, and people, connecting gameplay with real-world actions.
          </li>
          <li>
            <strong>Earn Real and Digital Rewards:</strong> Accumulate tokens, achievements, and real-world incentives tied to your contributions.
          </li>
          <li>
            <strong>Track and Share Your Impact:</strong> Use Omnia’s advanced metrics dashboard to visualize your contributions to environmental restoration efforts globally.
          </li>
        </ul>
      </section>

      {/* Why Omnia Matters */}
      <section>
        <Typography variant="h2">Why Omnia Matters</Typography>
        <Typography>
          Omnia bridges the gap between digital engagement and tangible environmental impact. 
          Each card you stake contributes to a measurable action, whether it's planting a tree, enhancing soil fertility, or conserving water. 
          By aligning personal goals with global sustainability targets, Omnia empowers users to be active participants in the fight against climate change.
        </Typography>
      </section>

      {/* Omnia’s Role in Buberry Worldwide */}
      <section>
        <Typography variant="h2">Omnia in the Buberry Worldwide Ecosystem</Typography>
        <Typography>
          As a core pillar of Buberry Worldwide, Omnia supports the platform’s broader objectives of fostering community-driven ecological regeneration. 
          Through its tokenized reward system and transparent data tracking, Omnia ensures that every action contributes to a verifiable positive outcome. 
          It connects local efforts with global goals, creating a scalable model for sustainability that anyone can join.
        </Typography>
      </section>

      {/* Getting Started */}
      <section>
        <Typography variant="h2">Getting Started with Omnia</Typography>
        <ul>
          <li>
            <strong>Stake Your Cards:</strong> Start staking NFT cards to earn tokens and make an immediate environmental impact.
          </li>
          <li>
            <strong>Explore Upcoming Features:</strong> Be part of new initiatives like tokenized marketplaces, regenerative workshops, and advanced mapping tools.
          </li>
          <li>
            <strong>Engage with the Community:</strong> Join a global network of changemakers dedicated to reversing environmental degradation.
          </li>
        </ul>
      </section>

      {/* FAQ Section */}
      <section>
        <Typography variant="h2">Frequently Asked Questions</Typography>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>What makes Omnia unique?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Omnia is not just a gamified platform; it's a bridge between digital innovation and real-world impact. 
              By tying rewards to ecological actions, Omnia ensures that individual contributions drive meaningful environmental change.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How does staking work?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Staking involves selecting an NFT card, linking it to a specific project, and earning rewards as that project progresses. Each card’s attributes determine its contributions and benefits.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>What rewards can I expect?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Rewards include tokens for in-platform use, access to workshops and exclusive content, and discounts on sustainable products. The more you stake, the greater your potential benefits.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </section>

      {/* Footer */}
      <footer>
        <Typography>
          Want to learn more? Visit our <a href="/faq">FAQ page</a> or reach out to us at{" "}
          <a href="mailto:support@omnia.com">support@omnia.com</a>. Together, we can transform sustainability into action.
        </Typography>
      </footer>
    </Box>
  );
};

export default AboutPage;
