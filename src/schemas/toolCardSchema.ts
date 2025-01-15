import { Schema } from "./cardSchemas";

export const toolCardSchema: Schema = {
  type: "Tool",
  fields: [
    { key: "name", label: "Tool Name", type: "text" },
    { key: "effect", label: "Effect", type: "text" },
    { key: "durability", label: "Durability (1-100)", type: "number", range: { min: 1, max: 100 } },
    { key: "compatible_with", label: "Compatible With", type: "select-multiple", options: ["People", "Land"] },
    { key: "bonus_actions", label: "Bonus Actions", type: "select-multiple", options: ["Tree removal", "Market resale", "Yield enhancement"] },
    {
      key: "boosts",
      label: "Boosts",
      type: "group",
      fields: [
        { key: "tree_removal_speed", label: "Tree Removal Speed", type: "number", range: { min: 1, max: 10 } },
        { key: "yield_multiplier", label: "Yield Multiplier", type: "number", range: { min: 1, max: 5 } }
      ]
    },
    {
      key: "dependencies",
      label: "Dependencies",
      type: "group",
      fields: [
        { key: "requires_person", label: "Requires Person", type: "boolean" },
        { key: "land_specific", label: "Land Specific", type: "boolean" }
      ]
    }
  ]
};
