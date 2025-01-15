import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const MetadataCreator = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [properties, setProperties] = useState<{ [key: string]: string }>({});
  const [metadata, setMetadata] = useState<any>(null);
  const [newPropertyKey, setNewPropertyKey] = useState("");
  const [newPropertyValue, setNewPropertyValue] = useState("");

  const generateMetadata = () => {
    const metadataJson = {
      name,
      description,
      image: imageUrl,
      properties: {
        ...properties,
        creator: "Buberry Worldwide",
        type: "NFT", // Example: Artwork, Land Card, etc.
      },
    };
    setMetadata(metadataJson);
  };

  const addProperty = () => {
    if (newPropertyKey && newPropertyValue) {
      setProperties((prev) => ({
        ...prev,
        [newPropertyKey]: newPropertyValue,
      }));
      setNewPropertyKey("");
      setNewPropertyValue("");
    }
  };

  const uploadToIPFS = async () => {
    if (!metadata) {
      alert("Generate metadata first!");
      return;
    }
    try {
      const response = await fetch("https://api.ipfs-service.com/upload", {
        method: "POST",
        body: JSON.stringify(metadata),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      alert(`Metadata uploaded! IPFS URI: ${data.uri}`);
    } catch (error) {
      console.error("Error uploading metadata to IPFS:", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" mb={2}>
        Create Metadata
      </Typography>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={3}
      />
      <TextField
        label="Image IPFS URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        fullWidth
        margin="normal"
      />

      {/* Properties Section */}
      <Typography variant="h6" mt={3}>
        Add Properties
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <TextField
          label="Property Key"
          value={newPropertyKey}
          onChange={(e) => setNewPropertyKey(e.target.value)}
        />
        <TextField
          label="Property Value"
          value={newPropertyValue}
          onChange={(e) => setNewPropertyValue(e.target.value)}
        />
        <Button variant="contained" onClick={addProperty}>
          Add Property
        </Button>
      </Box>
      <Box mt={2}>
        {Object.entries(properties).map(([key, value]) => (
          <Typography key={key}>
            {key}: {value}
          </Typography>
        ))}
      </Box>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={generateMetadata}
      >
        Generate Metadata
      </Button>

      {metadata && (
        <Box mt={4}>
          <Typography variant="h6">Generated Metadata:</Typography>
          <pre style={{ backgroundColor: "#f0f0f0", padding: "1em" }}>
            {JSON.stringify(metadata, null, 2)}
          </pre>
          <Button variant="contained" color="secondary" onClick={uploadToIPFS}>
            Upload to IPFS
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MetadataCreator;
