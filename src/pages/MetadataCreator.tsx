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

  // Handle metadata type changes
  const handleMetadataTypeChange = (type: "NFT" | "FT") => {
    setMetadataType(type);
    setFields([]);
    setFieldValues({});
    setErrors({});
    setCardType("");
    setName("");
    setDescription("");
    setImageUrl("");
    setArtworkType("");
    setEdition("");
    setUseCase("");
    setSpecialTrait("");
  };

  // Handle card type changes
  const handleCardTypeChange = (type: string) => {
    setCardType(type);
    const schema = cardSchemas[type];
    if (schema) {
      setFields(schema.fields);
      const defaultValues: Record<string, any> = {};
      schema.fields.forEach((field) => {
        if (field.type === "select-multiple" && field.key === "plant_types_allowed") {
          defaultValues[field.key] = schema.allowed_stakes || [];
        }
      });
      if (type === "Land" && schema.allowed_stakes) {
        defaultValues.allowed_stakes = schema.allowed_stakes;
      }
      setFieldValues(defaultValues);
      setErrors({});
    } else {
      console.error(`No schema found for card type: ${type}`);
    }
  };

  // Handle changes in form fields
  const handleFieldChange = (key: string, value: any) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // Validate fields
  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate cardType for NFTs
    if (metadataType === "NFT" && !cardType) {
      newErrors.cardType = "Card Type is required for NFTs.";
    }

    // Validate all required fields
    fields.forEach((field) => {
      if (field.required && !fieldValues[field.key]) {
        newErrors[field.key] = `${field.label} is required.`;
      }
    });

    // Validate allowed_stakes for Land cards
    if (
      metadataType === "NFT" &&
      cardType === "Land" &&
      (!fieldValues.allowed_stakes || fieldValues.allowed_stakes.length === 0)
    ) {
      newErrors.allowed_stakes = "Allowed stakes are required for Land cards.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generate metadata
  const generateMetadata = () => {
    if (!validateFields()) {
      alert("Please fill in all required fields.");
      return;
    }

    const properties: Record<string, any> = {
      "Artwork Type": artworkType || undefined,
      "Edition": edition || undefined,
      "Use Case": useCase || undefined,
      "Special Trait": specialTrait || undefined,
      ...fieldValues,
    };

    const metadataJson = {
      version: "1.0.0",
      ...(metadataType === "NFT" && { type: cardType }),
      name,
      description,
      image: imageUrl || undefined,
      properties,
    };

    setMetadata(metadataJson);
    alert("Metadata generated successfully!");
  };

  // Render fields dynamically
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

      {/* Card Type Selector */}
      {metadataType === "NFT" && (
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
          {!cardType && <FormHelperText>Card Type is required.</FormHelperText>}
        </FormControl>
      )}

      {/* NFT Basic Fields */}
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
        </>
      )}

      {/* Allowed Stakes for Land */}
      {cardType === "Land" && (
        <FormControl fullWidth sx={{ marginBottom: "16px" }}>
          <InputLabel>Allowed Stakes *</InputLabel>
          <Select
            multiple
            value={fieldValues.allowed_stakes || []}
            onChange={(e) => handleFieldChange("allowed_stakes", e.target.value)}
          >
            {cardSchemas.Land.allowed_stakes?.map((stake) => (
              <MenuItem key={stake} value={stake}>
                {stake}
              </MenuItem>
            ))}
          </Select>
          {errors.allowed_stakes && (
            <FormHelperText error>{errors.allowed_stakes}</FormHelperText>
          )}
        </FormControl>
      )}

      {/* Render Dynamic Fields */}
      {fields.map(renderField)}

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
