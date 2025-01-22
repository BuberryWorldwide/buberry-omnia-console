import { Schema } from "./cardSchemas";

export const peopleCardSchema: Schema = {
  type: "People",
  fields: [
    {
      key: "role",
      label: "Role",
      type: "select",
      options: ["Farmer", "Scientist", "Forester"],
      required: true,
    },
    {
      key: "special_ability",
      label: "Special Ability",
      type: "text",
      required: false,
    },
    {
      key: "tool_slots",
      label: "Tool Slots",
      type: "number",
      range: { min: 1, max: 3 },
      required: true,
    },
    {
      key: "allowed_tools",
      label: "Allowed Tools",
      type: "select-multiple",
      options: ["Shovel", "Axe", "Hoe", "Saw", "Pruners", "Chainsaw", "Bag"],
      required: true,
    },
    {
      key: "boosts",
      label: "Boosts",
      type: "group",
      fields: [
        {
          key: "tree_removal_speed",
          label: "Tree Removal Speed",
          type: "number",
          range: { min: 0, max: 10 },
          required: false,
        },
        {
          key: "yield_bonus",
          label: "Yield Bonus",
          type: "number",
          range: { min: 0, max: 100 },
          required: false,
        },
        {
          key: "work_speed_multiplier",
          label: "Work Speed Multiplier",
          type: "number",
          range: { min: 1, max: 5 },
          required: false,
        },
        {
          key: "resource_efficiency",
          label: "Resource Efficiency",
          type: "number",
          range: { min: 1, max: 10 },
          required: false,
        },
      ],
    },
    {
      key: "energy",
      label: "Energy",
      type: "group",
      fields: [
        {
          key: "max_energy",
          label: "Maximum Energy",
          type: "number",
          range: { min: 1, max: 100 },
          required: true,
        },
        {
          key: "energy_depletion_rate",
          label: "Energy Depletion Rate (per cycle)",
          type: "number",
          range: { min: 0.1, max: 5 },
          required: true,
        },
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
              required: true,
            },
            {
              key: "default_effects",
              label: "Default Effects",
              type: "group",
              fields: [
                {
                  key: "energy_restored",
                  label: "Energy Restored",
                  type: "number",
                  range: { min: 1, max: 50 },
                  required: false,
                },
                {
                  key: "bonus_effect",
                  label: "Bonus Effect",
                  type: "select",
                  options: ["Yield Bonus", "Speed Boost", "Durability Boost"],
                  required: false,
                },
                {
                  key: "duration",
                  label: "Bonus Duration (Turns)",
                  type: "number",
                  range: { min: 0, max: 10 },
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      key: "hydration",
      label: "Hydration",
      type: "group",
      fields: [
        {
          key: "max_hydration",
          label: "Maximum Hydration",
          type: "number",
          range: { min: 1, max: 100 },
          required: true,
        },
        {
          key: "hydration_depletion_rate",
          label: "Hydration Depletion Rate (per cycle)",
          type: "number",
          range: { min: 0.1, max: 5 },
          required: true,
        },
        {
          key: "replenishment_options",
          label: "Replenishment Options",
          type: "group",
          fields: [
            {
              key: "categories",
              label: "Allowed Categories",
              type: "select-multiple",
              options: ["Drink", "Special Consumable"],
              required: true,
            },
            {
              key: "default_effects",
              label: "Default Effects",
              type: "group",
              fields: [
                {
                  key: "hydration_restored",
                  label: "Hydration Restored",
                  type: "number",
                  range: { min: 1, max: 50 },
                  required: false,
                },
                {
                  key: "bonus_effect",
                  label: "Bonus Effect",
                  type: "select",
                  options: ["Yield Bonus", "Speed Boost", "Durability Boost"],
                  required: false,
                },
                {
                  key: "duration",
                  label: "Bonus Duration (Turns)",
                  type: "number",
                  range: { min: 0, max: 10 },
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      key: "available_actions",
      label: "Available Actions",
      type: "select-multiple",
      options: ["Plant", "Harvest", "Water", "Collect Scion Wood", "Chop Tree"],
      required: false,
    },
  ],
};
