import { Schema } from "./cardSchemas";

export const toolCardSchema: Schema = {
  type: "Tool",
  fields: [
    { key: "name", label: "Tool Name", type: "text", required: true },
    { key: "type", label: "Tool Type", type: "select", options: ["Pruner", "Chainsaw", "Watering Can", "Bag", "Ladder"], required: true },
    { key: "durability", label: "Durability (1-100)", type: "number", range: { min: 1, max: 100 }, required: true },
    {
      key: "compatible_with",
      label: "Compatible With",
      type: "select-multiple",
      options: ["Tree", "Person", "Land"],
      required: true,
    },
    {
      key: "bonus_actions",
      label: "Bonus Actions",
      type: "select-multiple",
      options: ["Tree Removal", "Harvest Enhancement", "Collect Scion Wood", "Increase Carbon Points"],
      required: false,
    },
    {
      key: "boosts",
      label: "Boosts",
      type: "group",
      fields: [
        { key: "tree_removal_speed", label: "Tree Removal Speed", type: "number", range: { min: 0, max: 10 }, required: false },
        { key: "yield_multiplier", label: "Yield Multiplier", type: "number", range: { min: 1, max: 5 }, required: false },
        { key: "energy_efficiency", label: "Energy Efficiency Boost", type: "number", range: { min: 1, max: 10 }, required: false },
      ],
    },
    {
      key: "dependencies",
      label: "Dependencies",
      type: "group",
      fields: [
        { key: "requires_person", label: "Requires a Person", type: "boolean", required: true },
        { key: "specific_land", label: "Specific to Certain Land Types", type: "boolean", required: false },
      ],
    },
    {
      key: "usage_constraints",
      label: "Usage Constraints",
      type: "group",
      fields: [
        {
          key: "minimum_stage",
          label: "Minimum Tree Growth Stage",
          type: "select",
          options: ["Sapling", "Small Tree", "Mature Tree", "Old Tree"],
          required: false,
        },
        {
          key: "excluded_actions",
          label: "Excluded Actions",
          type: "select-multiple",
          options: ["Water", "Harvest Fruit", "Collect Scion Wood", "Chop Tree"],
          required: false,
        },
      ],
    },
    {
      key: "output_effects",
      label: "Output Effects",
      type: "group",
      fields: [
        { key: "extra_carbon_points", label: "Extra Carbon Points", type: "number", range: { min: 0, max: 50 }, required: false },
        { key: "bonus_yield", label: "Bonus Yield", type: "number", range: { min: 0, max: 20 }, required: false },
        { key: "time_efficiency", label: "Time Efficiency (Turns Saved)", type: "number", range: { min: 0, max: 10 }, required: false },
      ],
    },
  ],
};
