import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import cardSchemas, { Schema, Field } from "../schemas/cardSchemas";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

const MetadataCreator: React.FC = () => {
  const [metadataType, setMetadataType] = useState<"NFT" | "FT">("NFT");
  const [metadata, setMetadata] = useState<any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [artworkType, setArtworkType] = useState("");
  const [edition, setEdition] = useState("");
  const [useCase, setUseCase] = useState("");
  const [specialTrait, setSpecialTrait] = useState("");
  const [cardType, setCardType] = useState<string>("");
  const [fields, setFields] = useState<Schema["fields"]>([]);
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate("/mdc-help");
  };

  const handleMetadataTypeChange = (type: "NFT" | "FT") => {
    setMetadataType(type);
    setFields([]);
    setFieldValues({});
    setErrors({});
    setCardType("");
    setImageUrl("");
    setArtworkType("");
    setEdition("");
    setUseCase("");
    setSpecialTrait("");
  };

  const handleCardTypeChange = (type: string) => {
    setCardType(type);
    const schema = cardSchemas[type];
    if (schema) {
      setFields(schema.fields);
      setFieldValues({});
      setErrors({});
    } else {
      console.error(`No schema found for card type: ${type}`);
    }
  };

  const handleFieldChange = (key: string, value: any) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };
  const renderField = (field: Field) => {
    const isRequired = field.required;
    const errorMessage = errors[field.key];

    switch (field.type) {
      case "select":
        return (
          <FormControl
            fullWidth
            sx={{ marginBottom: "16px" }}
            key={field.key}
            error={!!errorMessage}
          >
            <InputLabel>
              {field.label} {isRequired && "*"}
            </InputLabel>
            <Select
              value={fieldValues[field.key] || ""}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
            >
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
          </FormControl>
        );
      case "number":
        return (
          <TextField
            key={field.key}
            label={`${field.label} ${isRequired ? "*" : ""}`}
            type="number"
            value={fieldValues[field.key] || ""}
            onChange={(e) => handleFieldChange(field.key, Number(e.target.value))}
            fullWidth
            error={!!errorMessage}
            helperText={errorMessage || ""}
            sx={{ marginBottom: "16px" }}
          />
        );
      default:
        return (
          <TextField
            key={field.key}
            label={`${field.label} ${isRequired ? "*" : ""}`}
            value={fieldValues[field.key] || ""}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            fullWidth
            error={!!errorMessage}
            helperText={errorMessage || ""}
            sx={{ marginBottom: "16px" }}
          />
        );
    }
  };
  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.required && !fieldValues[field.key]) {
        newErrors[field.key] = `${field.label} is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const generateMetadata = () => {
    if (!validateFields()) {
      alert("Please fill in all required fields.");
      return;
    }

    const metadataJson = {
      version: "1.0.0",
      type: metadataType,
      name,
      description,
      ...(metadataType === "NFT" && {
        image: imageUrl,
        cardType,
        properties: {
          "Artwork Type": artworkType,
          "Edition": edition,
          "Use Case": useCase,
          "Special Trait": specialTrait,
          ...fieldValues,
        },
      }),

      ...(metadataType === "FT" && {
        properties: {
          ...fieldValues,
        },
      }),
    };

    setMetadata(metadataJson);
    alert("Metadata generated successfully!");
  };
  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Metadata Creator Tool
      </Typography>

      {/* Metadata Type Selector */}
      <FormControl fullWidth sx={{ marginBottom: "16px" }}>
  <InputLabel>Metadata Type</InputLabel>
  <Select
    value={metadataType}
    onChange={(e) => handleMetadataTypeChange(e.target.value as "NFT" | "FT")}
  >
    <MenuItem value="NFT">Non-Fungible Token (NFT)</MenuItem>
    <MenuItem value="FT">Fungible Token (FT)</MenuItem>
  </Select>
</FormControl>

{/* FT Metadata Fields */}
{metadataType === "FT" && (
  <>
    {/* Basic Information */}
    <TextField
      label="Name *"
      value={name}
      onChange={(e) => setName(e.target.value)}
      fullWidth
      sx={{ marginBottom: "16px" }}
    />
    <TextField
      label="Description *"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      fullWidth
      sx={{ marginBottom: "16px" }}
    />

    {/* Tokenomics */}
    <FormControl fullWidth sx={{ marginBottom: "16px" }}>
      <InputLabel>Supply Type *</InputLabel>
      <Select
        value={fieldValues.supplyType || ""}
        onChange={(e) => handleFieldChange("supplyType", e.target.value)}
      >
        <MenuItem value="Finite">Finite</MenuItem>
        <MenuItem value="Infinite">Infinite</MenuItem>
      </Select>
    </FormControl>
    {fieldValues.supplyType === "Finite" && (
      <TextField
        label="Initial Supply *"
        type="number"
        value={fieldValues.initialSupply || ""}
        onChange={(e) => handleFieldChange("initialSupply", Number(e.target.value))}
        fullWidth
        sx={{ marginBottom: "16px" }}
      />
    )}
    <TextField
      label="Decimal Places"
      type="number"
      value={fieldValues.decimalPlaces || ""}
      onChange={(e) => handleFieldChange("decimalPlaces", Number(e.target.value))}
      fullWidth
      sx={{ marginBottom: "16px" }}
    />

    {/* Replenishment Effects */}
    <FormControl fullWidth sx={{ marginBottom: "16px" }}>
      <InputLabel>Category</InputLabel>
      <Select
        value={fieldValues.category || ""}
        onChange={(e) => handleFieldChange("category", e.target.value)}
      >
        <MenuItem value="Food">Food</MenuItem>
        <MenuItem value="Drink">Drink</MenuItem>
        <MenuItem value="Special Consumable">Special Consumable</MenuItem>
      </Select>
    </FormControl>
    <TextField
      label="Energy Restored"
      type="number"
      value={fieldValues.energyRestored || ""}
      onChange={(e) => handleFieldChange("energyRestored", Number(e.target.value))}
      fullWidth
      sx={{ marginBottom: "16px" }}
    />
    <TextField
      label="Hydration Restored"
      type="number"
      value={fieldValues.hydrationRestored || ""}
      onChange={(e) => handleFieldChange("hydrationRestored", Number(e.target.value))}
      fullWidth
      sx={{ marginBottom: "16px" }}
    />
    <TextField
      label="Yield Bonus"
      type="number"
      value={fieldValues.yieldBonus || ""}
      onChange={(e) => handleFieldChange("yieldBonus", Number(e.target.value))}
      fullWidth
      sx={{ marginBottom: "16px" }}
    />
    <TextField
      label="Effect Duration (Turns)"
      type="number"
      value={fieldValues.duration || ""}
      onChange={(e) => handleFieldChange("duration", Number(e.target.value))}
      fullWidth
      sx={{ marginBottom: "16px" }}
    />
  </>
)}


      {/* NFT-Specific Fields */}
      {metadataType === "NFT" && (
        <>
          <TextField
            label="Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            label="Description *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            label="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            label="Artwork Type"
            value={artworkType}
            onChange={(e) => setArtworkType(e.target.value)}
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            label="Edition"
            value={edition}
            onChange={(e) => setEdition(e.target.value)}
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            label="Use Case"
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            label="Special Trait"
            value={specialTrait}
            onChange={(e) => setSpecialTrait(e.target.value)}
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
          <FormControl fullWidth sx={{ marginBottom: "16px" }}>
            <InputLabel>Card Type *</InputLabel>
            <Select
              value={cardType}
              onChange={(e) => handleCardTypeChange(e.target.value)}
            >
              {Object.keys(cardSchemas).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {fields.map(renderField)}
        </>
      )}

      {/* Buttons */}
      <Box display="flex" flexDirection="row" gap={2} mt={2}>
        <Button variant="contained" onClick={generateMetadata}>
          Generate Metadata
        </Button>
        <Button
          variant="outlined"
          onClick={() =>
            navigator.clipboard.writeText(JSON.stringify(metadata, null, 2))
          }
        >
          Copy Metadata
        </Button>
        <Button
          variant="outlined"
          onClick={() =>
            saveAs(new Blob([JSON.stringify(metadata, null, 2)]), `${name}.json`)
          }
        >
          Save as JSON
        </Button>
        <Button variant="outlined" onClick={handleNavigation}>
          Help
        </Button>
      </Box>

      {/* Metadata Preview */}
      {metadata && (
        <Box sx={{ marginTop: "20px" }}>
          <Typography variant="h6">Metadata Preview</Typography>
          <pre style={{ background: "grey", padding: "10px", borderRadius: "5px" }}>
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </Box>
      )}
    </Box>
  );
};

export default MetadataCreator;
