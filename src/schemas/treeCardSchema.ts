import { Schema } from "./cardSchemas";

export const treeCardSchema: Schema = {
  type: "Tree",
  fields: [
    { key: "variety", label: "Tree Variety", type: "text" },
    { key: "stage", label: "Growth Stage", type: "select", options: ["Sapling", "Mature"] },
    { key: "water_consumption", label: "Water Consumption", type: "number", range: { min: 1, max: 10 } },
    { key: "carbon_sequestration", label: "CO2 Points Per Unit Time", type: "number", range: { min: 0, max: 100 } },
    {
      key: "growth_stages",
      label: "Growth Stages",
      type: "group",
      fields: [
        { key: "stage", label: "Stage Name", type: "text" },
        { key: "duration", label: "Duration (seconds)", type: "number", range: { min: 1, max: 86400 } },
        { key: "water_required", label: "Water Required", type: "number", range: { min: 1, max: 100 } },
        { key: "yield_bonus", label: "Yield Bonus", type: "number", range: { min: 0, max: 10 } }
      ]
    }
  ]
};
