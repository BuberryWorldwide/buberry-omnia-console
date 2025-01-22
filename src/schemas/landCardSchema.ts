import { Schema } from "./cardSchemas";

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
    { key: "carbon_modifier", label: "Carbon Sequestration Modifier", type: "number", range: { min: 0.5, max: 2.0 }, required: false },
    { key: "water_efficiency_modifier", label: "Water Efficiency Modifier", type: "number", range: { min: 0.5, max: 2.0 }, required: false },
    { key: "resource_consumption_modifier", label: "Resource Consumption Modifier", type: "number", range: { min: 0.5, max: 2.0 }, required: false },
    {
      key: "boosts_from",
      label: "Boosts From",
      type: "select-multiple",
      options: ["People", "Tools"],
      required: false,
    },
    {
      key: "stake_rules",
      label: "Stake Rules",
      type: "group",
      fields: [
        { key: "allowed_card_types", label: "Allowed Card Types", type: "select-multiple", options: ["Tree", "Modifier"], required: true },
        { key: "bonus_for_rarity", label: "Bonus for Rarity", type: "text", required: false },
        { key: "exclusive_to", label: "Exclusive To", type: "text", required: false }
      ]
    },
    {
      key: "actions",
      label: "Available Actions",
      type: "select-multiple",
      options: ["Tree removal", "Yield enhancement", "Plant Tree", "Harvest Crop"],
      required: false,
    },
    {
      key: "resource_management",
      label: "Resource Management",
      type: "group",
      fields: [
        { key: "water_usage_per_plot", label: "Water Usage Per Plot", type: "number", range: { min: 1, max: 10 }, required: false },
        { key: "fertility_drain_rate", label: "Fertility Drain Rate", type: "number", range: { min: 0.1, max: 1.0 }, required: false },
        { key: "degradation_repair_cost", label: "Degradation Repair Cost", type: "number", range: { min: 1, max: 100 }, required: false }
      ]
    },
    {
      key: "dependencies",
      label: "Dependencies",
      type: "group",
      fields: [
        { key: "requires_people", label: "Requires People", type: "boolean", required: false },
        { key: "requires_tools", label: "Requires Tools", type: "boolean", required: false },
        { key: "exclusive_people", label: "Exclusive People", type: "select-multiple", options: ["Forester", "Farmer"], required: false }
      ]
    },
    {
      key: "modifiers",
      label: "Modifiers for Staked Items",
      type: "group",
      fields: [
        { key: "carbon_output_multiplier", label: "Carbon Output Multiplier", type: "number", range: { min: 0.1, max: 2.0 }, required: false },
        { key: "yield_bonus_multiplier", label: "Yield Bonus Multiplier", type: "number", range: { min: 0.1, max: 2.0 }, required: false },
        { key: "water_cost_multiplier", label: "Water Cost Multiplier", type: "number", range: { min: 0.1, max: 2.0 }, required: false },
      ]
    }
  ]
};
