// src/schemas/fungibleTokenSchema.ts
import { Schema } from "./cardSchemas";

export const fungibleTokenSchema: Schema = {
  type: "FungibleToken",
  fields: [
    { key: "name", label: "Token Name", type: "text", required: true },
    { key: "symbol", label: "Token Symbol", type: "text", required: true },
    { key: "description", label: "Description", type: "text", required: true },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: ["Resource", "Consumable", "Currency", "Utility", "Tokenized Asset"],
      required: true,
    },
    {
      key: "usage_limit",
      label: "Usage Limit",
      type: "number",
      range: { min: 0, max: 1000 },
      required: false,
    },
    {
      key: "compatibility",
      label: "Compatibility",
      type: "group",
      fields: [
        { key: "compatible_nfts", label: "Compatible NFTs", type: "select-multiple", options: ["Land", "People", "Tree"], required: false },
        { key: "stakeable", label: "Stakeable", type: "boolean", required: false },
      ],
    },
    { key: "initial_supply", label: "Initial Supply", type: "number", range: { min: 1, max: 100000000 }, required: true },
    { key: "decimals", label: "Decimals", type: "number", range: { min: 0, max: 18 }, required: true },
    {
      key: "special_properties",
      label: "Special Properties",
      type: "group",
      fields: [
        { key: "stackable", label: "Stackable", type: "boolean" },
        { key: "expiration", label: "Expiration (Turns)", type: "number", range: { min: 0, max: 100 }, required: false },
        { key: "replenishable", label: "Replenishable", type: "boolean", required: false },
      ],
    },
  ],
};

export default fungibleTokenSchema;
