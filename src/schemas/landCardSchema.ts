import { Schema } from "./cardSchemas";

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
    { key: "carbon_modifier", label: "Carbon Sequestration Modifier", type: "number", range: { min: 0.5, max: 2.0 } },
    { key: "water_efficiency_modifier", label: "Water Efficiency Modifier", type: "number", range: { min: 0.5, max: 2.0 } },
    { key: "resource_consumption_modifier", label: "Resource Consumption Modifier", type: "number", range: { min: 0.5, max: 2.0 } },
    {
      key: "boosts_from",
      label: "Boosts From",
      type: "select-multiple",
      options: ["People", "Tools"]
    },
    {
      key: "stake_rules",
      label: "Stake Rules",
      type: "group",
      fields: [
        { key: "allowed_card_types", label: "Allowed Card Types", type: "select-multiple", options: ["Tree", "Modifier"] },
        { key: "bonus_for_rarity", label: "Bonus for Rarity", type: "text" },
        { key: "exclusive_to", label: "Exclusive To", type: "text" }
      ]
    },
    {
      key: "actions",
      label: "Available Actions",
      type: "select-multiple",
      options: ["Tree removal", "Yield enhancement", "Plant Tree", "Harvest Crop"]
    },
    {
      key: "resource_management",
      label: "Resource Management",
      type: "group",
      fields: [
        { key: "water_usage_per_plot", label: "Water Usage Per Plot", type: "number", range: { min: 1, max: 10 } },
        { key: "fertility_drain_rate", label: "Fertility Drain Rate", type: "number", range: { min: 0.1, max: 1.0 } },
        { key: "degradation_repair_cost", label: "Degradation Repair Cost", type: "number", range: { min: 1, max: 100 } }
      ]
    },
    {
      key: "dependencies",
      label: "Dependencies",
      type: "group",
      fields: [
        { key: "requires_people", label: "Requires People", type: "boolean" },
        { key: "requires_tools", label: "Requires Tools", type: "boolean" },
        { key: "exclusive_people", label: "Exclusive People", type: "select-multiple", options: ["Forester", "Farmer"] }
      ]
    },
    {
      key: "rewards",
      label: "Rewards",
      type: "group",
      fields: [
        { key: "co2_points", label: "CO2 Points Per Plot", type: "number", range: { min: 1, max: 10 } },
        { key: "yield_bonus_per_cycle", label: "Yield Bonus Per Cycle", type: "number", range: { min: 0, max: 100 } }
      ]
    }
  ]
};
