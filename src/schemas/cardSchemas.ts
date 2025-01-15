import { treeCardSchema } from './treeCardSchema'; // Adjust the path to the actual file location
import { modifierCardSchema } from './modifierCardSchema'; // Adjust the path to the actual file location
import { toolCardSchema } from './toolCardSchema'; // Adjust the path to the actual file location
import { fungibleTokenSchema } from './fungibleTokenSchema'; // Adjust path based on your folder structure

// Field Interface
export interface Field {
  key: string;
  label: string;
  type: "select" | "number" | "text" | "group" | "select-multiple" | "boolean";
  options?: string[];
  range?: { min: number; max: number };
  fields?: Field[];
}

// Schema Interface
export interface Schema {
  type: string;
  fields: Field[];
}

// Land Schema
export const landCardSchema: Schema = {
  type: "Land",
  fields: [
    { key: "biome", label: "Biome", type: "select", options: ["Temperate", "Desert", "Tropical", "Arctic"] },
    { key: "fertility", label: "Fertility (1-10)", type: "number", range: { min: 1, max: 10 } },
    { key: "water_availability", label: "Water Availability", type: "select", options: ["Low", "Medium", "Abundant"] },
    { key: "degradation", label: "Degradation (1-10)", type: "number", range: { min: 1, max: 10 } },
    {
      key: "capacity",
      label: "Capacity",
      type: "group",
      fields: [
        { key: "plots", label: "Number of Plots", type: "number", range: { min: 1, max: 100 } },
        { key: "plant_types_allowed", label: "Plant Types Allowed", type: "select-multiple", options: ["Trees", "Shrubs", "Crops"] }
      ]
    },
    { key: "boosts_from", label: "Boosts From", type: "select-multiple", options: ["People", "Tools"] },
    { key: "actions", label: "Available Actions", type: "select-multiple", options: ["Tree removal", "Yield enhancement"] }
  ]
};

// People Schema
export const peopleCardSchema: Schema = {
  type: "People",
  fields: [
    { key: "role", label: "Role", type: "select", options: ["Farmer", "Scientist", "Forester"] },
    { key: "special_ability", label: "Special Ability", type: "text" },
    { key: "tool_slots", label: "Tool Slots", type: "number", range: { min: 1, max: 3 } },
    {
      key: "allowed_tools",
      label: "Allowed Tools",
      type: "select-multiple",
      options: ["Shovel", "Axe", "Hoe", "Saw"]
    },
    {
      key: "boosts",
      label: "Boosts",
      type: "group",
      fields: [
        { key: "tree_removal", label: "Tree Removal", type: "boolean" },
        { key: "yield_bonus", label: "Yield Bonus", type: "number", range: { min: 0, max: 100 } },
        { key: "work_speed_multiplier", label: "Work Speed Multiplier", type: "number", range: { min: 1, max: 5 } }
      ]
    },
    {
      key: "energy",
      label: "Energy",
      type: "group",
      fields: [
        { key: "max_energy", label: "Maximum Energy", type: "number", range: { min: 1, max: 100 } },
        { key: "energy_depletion_rate", label: "Energy Depletion Rate (per cycle)", type: "number", range: { min: 0.1, max: 5 } },
        {
          key: "replenishment_options",
          label: "Replenishment Options",
          type: "group",
          fields: [
            {
              key: "categories",
              label: "Allowed Categories",
              type: "select-multiple",
              options: ["Food", "Drink", "Special Consumable"]
            },
            {
              key: "default_effects",
              label: "Default Effects",
              type: "group",
              fields: [
                { key: "energy_restored", label: "Energy Restored", type: "number", range: { min: 1, max: 50 } },
                { key: "yield_bonus", label: "Yield Bonus", type: "number", range: { min: 0, max: 10 } },
                { key: "duration", label: "Bonus Duration (Turns)", type: "number", range: { min: 0, max: 10 } }
              ]
            }
          ]
        }
      ]
    },
    {
      key: "hydration",
      label: "Hydration",
      type: "group",
      fields: [
        { key: "max_hydration", label: "Maximum Hydration", type: "number", range: { min: 1, max: 100 } },
        { key: "hydration_depletion_rate", label: "Hydration Depletion Rate (per cycle)", type: "number", range: { min: 0.1, max: 5 } },
        {
          key: "replenishment_options",
          label: "Replenishment Options",
          type: "group",
          fields: [
            {
              key: "categories",
              label: "Allowed Categories",
              type: "select-multiple",
              options: ["Drink", "Special Consumable"]
            },
            {
              key: "default_effects",
              label: "Default Effects",
              type: "group",
              fields: [
                { key: "hydration_restored", label: "Hydration Restored", type: "number", range: { min: 1, max: 50 } },
                { key: "yield_bonus", label: "Yield Bonus", type: "number", range: { min: 0, max: 10 } },
                { key: "duration", label: "Bonus Duration (Turns)", type: "number", range: { min: 0, max: 10 } }
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
  FungibleToken: fungibleTokenSchema,

};

export interface Field {
  key: string;
  label: string;
  type: "select" | "number" | "text" | "group" | "select-multiple" | "boolean";
  options?: string[];
  range?: { min: number; max: number };
  fields?: Field[];
  required?: boolean; // Add this property to allow required fields
}


export default cardSchemas;
