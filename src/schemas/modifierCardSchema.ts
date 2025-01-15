import { Schema } from "./cardSchemas";

export const modifierCardSchema: Schema = {
  type: "Modifier",
  fields: [
    { key: "name", label: "Modifier Name", type: "text" },
    { key: "applies_to", label: "Applies To", type: "select", options: ["Land", "Tree", "People"] },
    { key: "effect_type", label: "Effect Type", type: "select", options: ["Increase Yield", "Reduce Water", "Restore Fertility"] },
    { key: "effect_value", label: "Effect Value", type: "number", range: { min: 0.1, max: 5.0 } },
    { key: "duration", label: "Duration (Turns)", type: "number", range: { min: 1, max: 10 } },
    { key: "stackable", label: "Stackable", type: "select", options: ["Yes", "No"] },
    {
      key: "rules",
      label: "Rules",
      type: "group",
      fields: [
        { key: "stackable", label: "Stackable", type: "boolean" },
        { key: "exclusive", label: "Exclusive", type: "boolean" }
      ]
    }
  ]
};
