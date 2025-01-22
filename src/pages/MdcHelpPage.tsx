import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const MdcHelpPage: React.FC = () => {
  const [showExamples, setShowExamples] = React.useState(false);

  const toggleExamples = () => setShowExamples(!showExamples);

  return (
    <Box sx={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Metadata Creator Tool: Help Guide
      </Typography>
      <Typography paragraph>
        This guide explains how to use the Metadata Creator Tool effectively to create JSON metadata
        for minting NFTs. Since metadata is immutable, it is crucial to enter the correct and
        standardized information for each card type. Use this guide to understand the structure,
        purpose, and constraints of each field.
      </Typography>

      <GeneralGuidance />
      <CardTypeDetails />
      <MetadataExamples showExamples={showExamples} toggleExamples={toggleExamples} />
    </Box>
  );
};

export default MdcHelpPage;

const GeneralGuidance: React.FC = () => (
  <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
    <Typography variant="h5" gutterBottom>
      General Guidance for Metadata Creation
    </Typography>
    <ul>
      <li>
        <strong>Name:</strong> Enter a unique and descriptive name for the NFT. This field is
        required and helps identify the card (e.g., "Golden Oak" or "Farmer Joe").
      </li>
      <li>
        <strong>Description:</strong> Provide a detailed explanation of the NFT’s purpose, role,
        or gameplay functionality.
      </li>
      <li>
        <strong>Image URL:</strong> Provide a valid URL pointing to the NFT’s image. Ensure the
        image accurately represents the card’s functionality.
      </li>
      <li>
        <strong>Card Type:</strong> Select the card type that defines the NFT’s purpose (e.g.,
        "Land", "Tree", "People").
      </li>
    </ul>
    <Typography variant="subtitle1" sx={{ marginTop: "10px" }}>
      Field Validation:
    </Typography>
    <ul>
      <li>
        Ensure numeric fields fall within the defined range (e.g., Fertility: 1-10 for Land cards).
      </li>
      <li>
        Use dropdown options (e.g., Biome or Growth Stage) as specified in this guide.
      </li>
      <li>
        Check for logical consistency. For example, tools must align with the actions allowed by
        the staked items on land.
      </li>
    </ul>
  </Paper>
);

const CardTypeDetails: React.FC = () => (
  <Box>
    <LandCardDetails />
    <TreeCardDetails />
    <PeopleCardDetails />
    <ToolCardDetails />
    {/* Add more card types if necessary */}
  </Box>
);

const LandCardDetails: React.FC = () => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Land Card Fields</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Typography variant="subtitle1">Required Fields:</Typography>
      <ul>
        <li>
          <strong>Biome:</strong> Environmental setting where the land exists. Options:
          Temperate, Desert, Tropical, Arctic.
        </li>
        <li>
          <strong>Fertility:</strong> Numeric value (1-10) representing soil richness.
        </li>
        <li>
          <strong>Water Availability:</strong> Options: Low, Medium, Abundant.
        </li>
        <li>
          <strong>Degradation:</strong> Numeric value (1-10) representing land wear.
        </li>
      </ul>
      <Typography variant="subtitle1">Capacity Fields:</Typography>
      <ul>
        <li>
          <strong>Plots:</strong> Number of plots available for staking items (1-100).
        </li>
        <li>
          <strong>Plant Types Allowed:</strong> Select one or more types (e.g., Trees, Shrubs,
          Crops).
        </li>
      </ul>
    </AccordionDetails>
  </Accordion>
);

const TreeCardDetails: React.FC = () => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Tree Card Fields</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Typography variant="subtitle1">Required Fields:</Typography>
      <ul>
        <li>
          <strong>Variety:</strong> Enter the tree’s species or variety (e.g., "Apple Tree").
        </li>
        <li>
          <strong>Growth Stage:</strong> Select one: Sapling, Mature, Old Tree.
        </li>
        <li>
          <strong>Water Consumption:</strong> Numeric value from 1-10 for water usage.
        </li>
      </ul>
      <Typography variant="subtitle1">Optional Fields:</Typography>
      <ul>
        <li>
          <strong>Available Actions:</strong> Actions available based on growth stage (e.g.,
          Harvest Fruit, Collect Scion Wood).
        </li>
        <li>
          <strong>Output Rewards:</strong> Define rewards (e.g., Carbon Points: 10, Fruit Yield: 5).
        </li>
      </ul>
    </AccordionDetails>
  </Accordion>
);

const PeopleCardDetails: React.FC = () => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>People Card Fields</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Typography variant="subtitle1">Required Fields:</Typography>
      <ul>
        <li>
          <strong>Role:</strong> Character role (e.g., Farmer, Scientist, Forester).
        </li>
        <li>
          <strong>Tool Slots:</strong> Number of tools the character can equip (1-3).
        </li>
        <li>
          <strong>Energy:</strong> Maximum energy, depletion rate, and replenishment options.
        </li>
      </ul>
      <Typography variant="subtitle1">Boost Fields:</Typography>
      <ul>
        <li>
          <strong>Tree Removal:</strong> Boolean indicating if the character can remove trees.
        </li>
        <li>
          <strong>Yield Bonus:</strong> Percentage boost to yields.
        </li>
      </ul>
    </AccordionDetails>
  </Accordion>
);

const ToolCardDetails: React.FC = () => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Tool Card Fields</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Typography variant="subtitle1">Required Fields:</Typography>
      <ul>
        <li>
          <strong>Name:</strong> Enter the tool’s name (e.g., "Golden Shovel").
        </li>
        <li>
          <strong>Effect:</strong> Describe the tool’s primary functionality.
        </li>
        <li>
          <strong>Durability:</strong> Numeric value (1-100) indicating tool lifespan.
        </li>
      </ul>
      <Typography variant="subtitle1">Compatibility Fields:</Typography>
      <ul>
        <li>
          <strong>Compatible With:</strong> Types the tool works with (e.g., People, Land).
        </li>
        <li>
          <strong>Bonus Actions:</strong> Define extra actions the tool enables (e.g., Tree
          Removal, Yield Enhancement).
        </li>
      </ul>
    </AccordionDetails>
  </Accordion>
);

const MetadataExamples: React.FC<{ showExamples: boolean; toggleExamples: () => void }> = ({
  showExamples,
  toggleExamples,
}) => (
  <Paper sx={{ padding: "20px", marginTop: "20px" }}>
    <Typography variant="h5" gutterBottom>
      Metadata Examples
    </Typography>
    <Typography paragraph>
      These examples provide complete JSON structures for each card type. Use these as references
      when creating metadata to ensure consistency and correctness.
    </Typography>
    <Button variant="outlined" onClick={toggleExamples} sx={{ marginBottom: "10px" }}>
      {showExamples ? "Hide Examples" : "Show Examples"}
    </Button>
    {showExamples && (
      <Box sx={{ marginTop: "20px" }}>
        <LandCardMetadataExample />
        <TreeCardMetadataExample />
        <PeopleCardMetadataExample />
        <ToolCardMetadataExample />
      </Box>
    )}
  </Paper>
);

const LandCardMetadataExample: React.FC = () => (
  <Box sx={{ marginBottom: "20px" }}>
    <Typography variant="h6">Land Metadata Example:</Typography>
    <pre style={{ backgroundColor: "#1e1e1e", color: "#fff", padding: "10px", borderRadius: "5px" }}>
{`
{
  "name": "Sunny Meadow",
  "description": "A fertile field ideal for growing trees and crops.",
  "type": "Land",
  "properties": {
    "biome": "Temperate",
    "fertility": 8,
    "water_availability": "Abundant",
    "degradation": 2,
    "capacity": {
      "plots": 10,
      "plant_types_allowed": ["Trees", "Crops"]
    },
    "boosts_from": ["People", "Tools"],
    "actions": ["Plant Tree", "Harvest Crop"]
  }
}
`}
    </pre>
  </Box>
);

const TreeCardMetadataExample: React.FC = () => (
  <Box sx={{ marginBottom: "20px" }}>
    <Typography variant="h6">Tree Metadata Example:</Typography>
    <pre style={{ backgroundColor: "#1e1e1e", color: "#fff", padding: "10px", borderRadius: "5px" }}>
{`
{
  "name": "Golden Oak",
  "description": "A rare oak tree that sequesters high amounts of carbon and produces premium wood.",
  "type": "Tree",
  "properties": {
    "variety": "Golden Oak",
    "growth_stage": "Mature",
    "water_consumption": 7,
    "available_actions": ["Harvest Wood", "Collect Scion Wood"],
    "output_rewards": {
      "carbon_points": 15,
      "biodiversity_points": 10,
      "wood_yield": 5
    }
  }
}
`}
    </pre>
  </Box>
);

const PeopleCardMetadataExample: React.FC = () => (
  <Box sx={{ marginBottom: "20px" }}>
    <Typography variant="h6">People Metadata Example:</Typography>
    <pre style={{ backgroundColor: "#1e1e1e", color: "#fff", padding: "10px", borderRadius: "5px" }}>
{`
{
  "name": "Farmer Joe",
  "description": "An experienced farmer skilled in crop cultivation.",
  "type": "People",
  "properties": {
    "role": "Farmer",
    "tool_slots": 2,
    "allowed_tools": ["Hoe", "Shovel"],
    "boosts": {
      "yield_bonus": 10,
      "work_speed_multiplier": 1.5
    },
    "energy": {
      "max_energy": 100,
      "energy_depletion_rate": 2,
      "replenishment_options": {
        "categories": ["Food", "Drink"],
        "default_effects": {
          "energy_restored": 20,
          "yield_bonus": 5,
          "duration": 10
        }
      }
    },
    "hydration": {
      "max_hydration": 50,
      "hydration_depletion_rate": 1,
      "replenishment_options": {
        "categories": ["Drink"],
        "default_effects": {
          "hydration_restored": 15,
          "yield_bonus": 3,
          "duration": 5
        }
      }
    }
  }
}
`}
    </pre>
  </Box>
);

const ToolCardMetadataExample: React.FC = () => (
  <Box sx={{ marginBottom: "20px" }}>
    <Typography variant="h6">Tool Metadata Example:</Typography>
    <pre style={{ backgroundColor: "#1e1e1e", color: "#fff", padding: "10px", borderRadius: "5px" }}>
{`
{
  "name": "Golden Shovel",
  "description": "A durable shovel that increases digging efficiency.",
  "type": "Tool",
  "properties": {
    "effect": "Digging Efficiency",
    "durability": 100,
    "compatible_with": ["People"],
    "bonus_actions": ["Tree Removal", "Soil Aeration"]
  }
}
`}
    </pre>
  </Box>
);
