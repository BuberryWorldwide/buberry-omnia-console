import { Schema } from "./cardSchemas";

export const treeCardSchema: Schema = {
  type: "Tree",
  fields: [
    { key: "variety", label: "Tree Variety", type: "text", required: true },
    {
      key: "stage",
      label: "Growth Stage",
      type: "select",
      options: ["Sapling", "Small Tree", "Mature Tree", "Old Tree"],
      required: true,
    },
    {
      key: "water_consumption",
      label: "Water Consumption Per Cycle",
      type: "number",
      range: { min: 1, max: 10 },
      required: true,
    },
    {
      key: "carbon_sequestration",
      label: "CO2 Points Per Cycle",
      type: "number",
      range: { min: 0, max: 100 },
      required: true,
    },
    {
      key: "growth_stages",
      label: "Growth Stages",
      type: "group",
      fields: [
        { key: "stage_name", label: "Stage Name", type: "text", required: true },
        {
          key: "duration",
          label: "Duration to Next Stage (seconds)",
          type: "number",
          range: { min: 1, max: 86400 },
          required: true,
        },
        {
          key: "requirements",
          label: "Growth Requirements",
          type: "group",
          fields: [
            {
              key: "water",
              label: "Water Required",
              type: "number",
              range: { min: 1, max: 100 },
              required: true,
            },
            {
              key: "energy",
              label: "Energy Required",
              type: "number",
              range: { min: 1, max: 50 },
              required: false,
            },
          ],
        },
        {
          key: "unlocks",
          label: "Unlocked Actions/Rewards",
          type: "group",
          fields: [
            {
              key: "compatible_tools",
              label: "Compatible Tools",
              type: "select-multiple",
              options: ["Pruners", "Saw", "Watering Can", "Harvester"],
              required: false,
            },
            {
              key: "available_actions",
              label: "Available Actions",
              type: "select-multiple",
              options: ["Water", "Harvest Fruit", "Collect Scion Wood", "Chop Tree"],
              required: false,
            },
            {
              key: "output_rewards",
              label: "Output Rewards",
              type: "group",
              fields: [
                { key: "carbon_points", label: "Carbon Points", type: "number", range: { min: 0, max: 50 } },
                { key: "biodiversity_points", label: "Biodiversity Points", type: "number", range: { min: 0, max: 20 } },
                { key: "fruit_yield", label: "Fruit Yield", type: "number", range: { min: 0, max: 10 } },
                { key: "fodder_yield", label: "Fodder Yield", type: "number", range: { min: 0, max: 10 } },
                { key: "scion_wood_yield", label: "Scion Wood Yield", type: "number", range: { min: 0, max: 10 } },
              ],
            },
          ],
        },
      ],
    },
    {
      key: "stage_progression",
      label: "Stage Progression",
      type: "group",
      fields: [
        { key: "current_stage", label: "Current Stage", type: "text", required: true },
        { key: "time_to_next_stage", label: "Time to Next Stage (seconds)", type: "number", range: { min: 1, max: 86400 }, required: true },
        {
          key: "next_stage_requirements",
          label: "Requirements to Progress",
          type: "group",
          fields: [
            { key: "water", label: "Water Required", type: "number", range: { min: 1, max: 100 }, required: true },
            { key: "energy", label: "Energy Required", type: "number", range: { min: 1, max: 50 }, required: false },
          ],
        },
      ],
    },
    {
      key: "tool_compatibility",
      label: "Tool Compatibility Rules",
      type: "group",
      fields: [
        {
          key: "action_specific_tools",
          label: "Tools for Actions",
          type: "group",
          fields: [
            {
              key: "Water",
              label: "Water Tools",
              type: "select-multiple",
              options: ["Watering Can", "Irrigation System"],
            },
            {
              key: "Harvest Fruit",
              label: "Harvest Tools",
              type: "select-multiple",
              options: ["Bag", "Ladder"],
            },
            {
              key: "Collect Scion Wood",
              label: "Pruning Tools",
              type: "select-multiple",
              options: ["Pruners", "Chainsaw"],
            },
            {
              key: "Chop Tree",
              label: "Chopping Tools",
              type: "select-multiple",
              options: ["Axe", "Chainsaw"],
            },
          ],
        },
      ],
    },
  ],
};
