import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";

const MdcHelpPage: React.FC = () => {
  const [showExamples, setShowExamples] = React.useState(false);

  const toggleExamples = () => {
    setShowExamples(!showExamples);
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      {/* Introduction */}
      <Typography variant="h4" gutterBottom>
        Metadata Creator Help
      </Typography>
      <Typography paragraph>
        The Metadata Creator tool allows you to generate JSON metadata for NFTs. This metadata defines
        the characteristics and functionality of NFTs in your system. Below, you’ll find detailed
        descriptions of each field and guidance on how to use the tool effectively.
      </Typography>

      {/* Field Descriptions */}
      <Paper sx={{ padding: "20px", marginBottom: "20px", backgroundColor: "rgba(46, 46, 46, 0.8)", color: "#fff", backdropFilter: "blur(5px)" }}>
        <Typography variant="h5" gutterBottom>
          Field Descriptions
        </Typography>
        <ul>
          <li>
            <strong>Name:</strong> The name of the NFT. This is required and should be unique.
            <ul>
              <li><strong>Why:</strong> Helps identify the NFT in your system.</li>
              <li><strong>Example:</strong> "Golden Oak"</li>
            </ul>
          </li>
          <li>
            <strong>Description:</strong> A detailed explanation of the NFT’s purpose or lore.
            <ul>
              <li><strong>Why:</strong> Provides context for collectors or players.</li>
              <li><strong>Example:</strong> "A rare golden oak tree that enhances yield on temperate land."</li>
            </ul>
          </li>
          <li>
            <strong>Image URL:</strong> A link to the image representing the NFT.
            <ul>
              <li><strong>Why:</strong> Ensures the NFT has a visual representation.</li>
              <li><strong>Example:</strong> "https://example.com/images/golden-oak.png"</li>
            </ul>
          </li>
          <li>
            <strong>Card Type:</strong> The type of NFT (e.g., Land, Tree, People).
            <ul>
              <li><strong>Why:</strong> Determines additional fields and functionality.</li>
              <li><strong>Example:</strong> "Tree"</li>
            </ul>
          </li>
        </ul>
      </Paper>

      {/* Dynamic Fields */}
      <Paper sx={{ padding: "20px", marginBottom: "20px", backgroundColor: "rgba(46, 46, 46, 0.8)", color: "#fff", backdropFilter: "blur(5px)" }}>
        <Typography variant="h5" gutterBottom>
          Dynamic Fields Based on Card Type
        </Typography>
        <Typography paragraph>
          Depending on the selected <strong>Card Type</strong>, additional fields will appear. These fields define specific
          characteristics for the card type.
        </Typography>
        <ul>
          <li>
            <strong>Land Fields:</strong>
            <ul>
              <li><strong>Biome:</strong> Environmental setting (e.g., "Temperate").</li>
              <li><strong>Fertility:</strong> Numerical value (1-10) for plant growth potential.</li>
              <li><strong>Water Availability:</strong> Level of water present (e.g., "Medium").</li>
            </ul>
          </li>
          <li>
            <strong>Tree Fields:</strong>
            <ul>
              <li><strong>Variety:</strong> Species of the tree (e.g., "Golden Oak").</li>
              <li><strong>Growth Stage:</strong> Current stage of the tree (e.g., "Sapling").</li>
              <li><strong>Yield:</strong> Number of tokens or fruit produced.</li>
            </ul>
          </li>
          <li>
            <strong>People Fields:</strong>
            <ul>
              <li><strong>Role:</strong> Character’s role in gameplay (e.g., "Farmer").</li>
              <li><strong>Tool Slots:</strong> Number of tools the character can equip (1-3).</li>
              <li><strong>Energy:</strong> Maximum energy and depletion rate for tasks.</li>
              <li><strong>Hydration:</strong> Maximum hydration and depletion rate.</li>
            </ul>
          </li>
        </ul>
      </Paper>

      {/* Example Use Cases */}
      <Paper sx={{ padding: "20px", backgroundColor: "rgba(46, 46, 46, 0.8)", color: "#fff", backdropFilter: "blur(5px)" }}>
        <Typography variant="h5" gutterBottom>
          Example Use Cases
        </Typography>
        <Typography paragraph>
          Here’s an example of metadata for a Tree card:
        </Typography>
        <pre style={{ backgroundColor: "#1e1e1e", color: "#fff", padding: "10px", borderRadius: "5px", overflowX: "auto" }}>{`
{
  "name": "Golden Oak",
  "description": "A rare golden oak tree that enhances yield on temperate land.",
  "type": "Tree",
  "properties": {
    "Variety": "Golden Oak",
    "Growth Stage": "Sapling",
    "Water Consumption": 3,
    "Yield": 10
  }
}
        `}</pre>
        <Typography paragraph>
          This metadata defines a tree that provides a moderate yield and consumes minimal water.
        </Typography>

        <Typography paragraph>
          Here’s an example of metadata for a People card:
        </Typography>
        <pre style={{ backgroundColor: "#1e1e1e", color: "#fff", padding: "10px", borderRadius: "5px", overflowX: "auto" }}>{`
{
  "name": "Farmer Joe",
  "description": "A hardworking farmer specializing in crops.",
  "type": "People",
  "properties": {
    "Role": "Farmer",
    "Max Energy": 100,
    "Energy Depletion Rate": 2,
    "Max Hydration": 50,
    "Hydration Depletion Rate": 1,
    "Replenishment Options": {
      "Categories": ["Food", "Drink"],
      "Default Effects": {
        "Energy Restored": 15,
        "Hydration Restored": 10,
        "Yield Bonus": 5,
        "Duration": 5
      }
    }
  }
}
        `}</pre>

        <Button
          variant="outlined"
          sx={{ marginTop: "10px" }}
          onClick={toggleExamples}
        >
          {showExamples ? "Hide More Examples" : "Show More Examples"}
        </Button>

        {showExamples && (
          <Box sx={{ marginTop: "20px" }}>
            <Typography paragraph>
              Here’s an example of metadata for a Land card:
            </Typography>
            <pre style={{ backgroundColor: "#1e1e1e", color: "#fff", padding: "10px", borderRadius: "5px", overflowX: "auto" }}>{`
{
  "name": "Sunny Field",
  "description": "A fertile field with abundant water availability.",
  "type": "Land",
  "properties": {
    "Biome": "Temperate",
    "Fertility": 8,
    "Water Availability": "Abundant",
    "Capacity": {
      "Plots": 10,
      "Plant Types Allowed": ["Trees", "Crops"]
    }
  }
}
            `}</pre>

            <Typography paragraph>
              Here’s an example of metadata for a Modifier card:
            </Typography>
            <pre style={{ backgroundColor: "#1e1e1e", color: "#fff", padding: "10px", borderRadius: "5px", overflowX: "auto" }}>{`
{
  "name": "Fertility Booster",
  "description": "A modifier that enhances soil fertility for better yield.",
  "type": "Modifier",
  "properties": {
    "Effect Type": "Increase Yield",
    "Effect Value": 1.5,
    "Duration": 10,
    "Stackable": "Yes"
  }
}
            `}</pre>

            <Typography paragraph>
              Here’s an example of metadata for a Tool card:
            </Typography>
            <pre style={{ backgroundColor: "#1e1e1e", color: "#fff", padding: "10px", borderRadius: "5px", overflowX: "auto" }}>{`
{
  "name": "Golden Shovel",
  "description": "A specialized tool for efficient tree removal.",
  "type": "Tool",
  "properties": {
    "Effect": "Tree Removal Efficiency",
    "Durability": 100,
    "Compatible With": ["People"],
    "Bonus Actions": ["Tree removal"]
  }
}
            `}</pre>

            <Typography paragraph>
              These examples illustrate how to structure metadata for different card types in the system. Adjust values
              according to the specific characteristics of the NFT you’re creating.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default MdcHelpPage;
