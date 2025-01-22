// Importing individual card schemas
import { treeCardSchema } from "./treeCardSchema"; // Adjust path as necessary
import { modifierCardSchema } from "./modifierCardSchema"; // Adjust path as necessary
import { toolCardSchema } from "./toolCardSchema"; // Adjust path as necessary
import { fungibleTokenSchema } from "./fungibleTokenSchema"; // Adjust path as necessary
import { structureCardSchema } from "./structureCardSchema";



// Field Interface
export interface Field {
  key: string; // Unique identifier for the field
  label: string; // Display label for the field
  type: "select" | "number" | "text" | "group" | "select-multiple" | "boolean"; // Field type
  options?: string[]; // Dropdown or multiple selection options
  range?: { min: number; max: number }; // Range for numerical fields
  fields?: Field[]; // Nested fields for groups
  required?: boolean; // Marks the field as required
}

// Schema Interface
export interface Schema {
  type: string; // Type of card (e.g., "Land", "People", "Tree")
  fields: Field[]; // Fields defining the card's structure
  allowed_stakes?: string[]; // Defines stakeable token types (if applicable)
}

// Land Schema
export const landCardSchema: Schema = {
  type: "Land",
  fields: [
    { key: "biome", label: "Biome", type: "select", options: ["Temperate", "Desert", "Tropical", "Arctic"], required: true },
    { key: "fertility", label: "Fertility (1-10)", type: "number", range: { min: 1, max: 10 }, required: true },
    { key: "water_availability", label: "Water Availability", type: "select", options: ["Low", "Medium", "Abundant"], required: true },
    { key: "degradation", label: "Degradation (1-10)", type: "number", range: { min: 1, max: 10 }, required: true },
    {
      key: "capacity",
      label: "Capacity",
      type: "group",
      fields: [
        { key: "plots", label: "Number of Plots", type: "number", range: { min: 1, max: 100 }, required: true },
        { key: "plant_types_allowed", label: "Plant Types Allowed", type: "select-multiple", options: ["Trees", "Shrubs", "Crops"], required: true }
      ]
    },
    { key: "boosts_from", label: "Boosts From", type: "select-multiple", options: ["People", "Tools"], required: false },
    {
      key: "actions",
      label: "Available Actions",
      type: "select-multiple",
      options: ["Tree removal", "Yield enhancement"],
      required: false
    }
  ],
  allowed_stakes: ["Tree", "Crop", "Shrub", "Structure", "Livestock", "Tool", "Person"] // Initial set of allowed stakes
};

// People Schema
export const peopleCardSchema: Schema = {
  type: "People",
  fields: [
    { key: "role", label: "Role", type: "select", options: ["Farmer", "Scientist", "Forester"], required: true },
    { key: "special_ability", label: "Special Ability", type: "text", required: false },
    { key: "tool_slots", label: "Tool Slots", type: "number", range: { min: 1, max: 3 }, required: true },
    {
      key: "allowed_tools",
      label: "Allowed Tools",
      type: "select-multiple",
      options: ["Shovel", "Axe", "Hoe", "Saw"],
      required: true
    },
    {
      key: "boosts",
      label: "Boosts",
      type: "group",
      fields: [
        { key: "tree_removal", label: "Tree Removal", type: "boolean", required: false },
        { key: "yield_bonus", label: "Yield Bonus", type: "number", range: { min: 0, max: 100 }, required: false },
        { key: "work_speed_multiplier", label: "Work Speed Multiplier", type: "number", range: { min: 1, max: 5 }, required: false }
      ]
    },
    {
      key: "energy",
      label: "Energy",
      type: "group",
      fields: [
        { key: "max_energy", label: "Maximum Energy", type: "number", range: { min: 1, max: 100 }, required: true },
        { key: "energy_depletion_rate", label: "Energy Depletion Rate (per cycle)", type: "number", range: { min: 0.1, max: 5 }, required: true },
        {
          key: "replenishment_options",
          label: "Replenishment Options",
          type: "group",
          fields: [
            {
              key: "categories",
              label: "Allowed Categories",
              type: "select-multiple",
              options: ["Food", "Drink", "Special Consumable"],
              required: true
            },
            {
              key: "default_effects",
              label: "Default Effects",
              type: "group",
              fields: [
                { key: "energy_restored", label: "Energy Restored", type: "number", range: { min: 1, max: 50 }, required: false },
                { key: "yield_bonus", label: "Yield Bonus", type: "number", range: { min: 0, max: 10 }, required: false },
                { key: "duration", label: "Bonus Duration (Turns)", type: "number", range: { min: 0, max: 10 }, required: false }
              ]
            }
          ]
        }
      ]
    }
  ]
};


// Aggregated Schemas
const cardSchemas: Record<string, Schema> = {
  Land: landCardSchema,
  People: peopleCardSchema,
  Tree: treeCardSchema,
  Modifier: modifierCardSchema,
  Tool: toolCardSchema,
  Structure: structureCardSchema, // Include the new Structure schema
  FungibleToken: fungibleTokenSchema
};

// Utility to fetch schemas dynamically
export const getSchemaByType = (type: string): Schema | undefined => cardSchemas[type];

// Exporting the card schemas
export default cardSchemas;
