const express = require("express");
const fs = require("fs");
const path = require("path");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid"); // Use UUID for unique IDs

const app = express();
app.use(express.json());

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only React app origin
  })
);

// Helper functions for JSON operations
const ensureFileExists = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf8");
  }
};

const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
};

const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error.message);
  }
};

// Paths for JSON files
const nftRecordsPath = path.join(__dirname, "data", "nft_records.json");
const stakingRecordsPath = path.join(__dirname, "data", "staking_records.json");
const supplyKeyPath = path.join(__dirname, "data", "supply-key.json");

// Ensure data directory and files exist
ensureFileExists(nftRecordsPath);
ensureFileExists(stakingRecordsPath);
ensureFileExists(supplyKeyPath);

// Validation Schemas
const nftSchema = Joi.object({
  id: Joi.string().optional(), // ID will be auto-generated if not provided
  type: Joi.string().valid("Tree", "Land", "Modifier").required(),
  attributes: Joi.object({
    carbon_sequestration: Joi.number().min(0).max(100).optional(),
    water_consumption: Joi.number().min(0).max(100).optional(),
    fertility: Joi.number().min(1).max(10).optional(),
    water_availability: Joi.string().valid("Low", "Medium", "Abundant").optional(),
  }).required(),
});

// --- Save NFT Records ---
app.post("/nft", (req, res) => {
  const { tokenId, tokenName, tokenSymbol, tokenMemo, tokenType, supplyType } = req.body;

  if (!tokenId || !tokenName || !tokenSymbol || !tokenMemo || !tokenType || !supplyType) {
    return res.status(400).json({ error: "Invalid token data. All fields are required." });
  }

  const nftRecords = readJsonFile(nftRecordsPath);

  const newRecord = { ...req.body, id: uuidv4() }; // Ensure unique ID
  nftRecords.push(newRecord);
  writeJsonFile(nftRecordsPath, nftRecords);

  res.json({ success: true, message: "Token saved successfully!", record: newRecord });
});

// --- Get All NFT Records ---
app.get("/nft-records", (req, res) => {
  try {
    const nftRecords = readJsonFile(nftRecordsPath);
    res.json(nftRecords);
  } catch (error) {
    console.error("Error reading nft_records.json:", error.message);
    res.status(500).json({ error: "Failed to load NFT records." });
  }
});

// --- Delete an NFT Record ---
app.delete("/nft-records/:id", (req, res) => {
  const { id } = req.params;

  try {
    const nftRecords = readJsonFile(nftRecordsPath);
    const updatedRecords = nftRecords.filter((record) => record.id !== id);

    if (nftRecords.length === updatedRecords.length) {
      return res.status(404).json({ error: "NFT record not found." });
    }

    writeJsonFile(nftRecordsPath, updatedRecords);

    console.log(`NFT record with ID ${id} deleted.`);
    res.json({ success: true, message: "NFT record deleted successfully!" });
  } catch (error) {
    console.error("Error deleting NFT record:", error.message);
    res.status(500).json({ error: "Failed to delete NFT record." });
  }
});

// --- Serve Supply Key ---
app.get("/supply-key", (req, res) => {
  try {
    const supplyKeyData = readJsonFile(supplyKeyPath);
    res.json(supplyKeyData);
  } catch (error) {
    console.error("Error fetching supply key:", error.message);
    res.status(500).json({ error: "Failed to fetch supply key." });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
