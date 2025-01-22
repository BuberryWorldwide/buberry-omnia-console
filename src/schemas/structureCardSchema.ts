import { Schema } from "./cardSchemas"; // Adjust the import path if necessary

// Structure Schema
export const structureCardSchema: Schema = {
  type: "Structure",
  fields: [
    {
      key: "name",
      label: "Name",
      type: "text",
      required: true, // The name of the structure is mandatory
    },
    {
      key: "functionality",
      label: "Functionality",
      type: "select",
      options: ["Storage", "Shelter", "Energy", "Production"],
      required: true, // Users must select the structure's functionality
    },
    {
      key: "capacity",
      label: "Capacity",
      type: "number",
      range: { min: 1, max: 100 },
      required: true, // Defines the maximum capacity of the structure
    },
    {
      key: "boosts",
      label: "Boosts",
      type: "group",
      fields: [
        {
          key: "production_boost",
          label: "Production Boost",
          type: "number",
          range: { min: 0, max: 100 },
          required: false, // Optional boost to production metrics
        },
        {
          key: "storage_boost",
          label: "Storage Boost",
          type: "number",
          range: { min: 0, max: 100 },
          required: false, // Optional boost to storage metrics
        },
        {
          key: "energy_efficiency",
          label: "Energy Efficiency",
          type: "number",
          range: { min: 0, max: 100 },
          required: false, // Optional boost to energy usage efficiency
        },
      ],
    },
    {
      key: "required_resources",
      label: "Required Resources",
      type: "select-multiple",
      options: ["Wood", "Stone", "Metal", "Energy"],
      required: false, // Materials needed to construct or maintain the structure
    },
  ],
};

export default structureCardSchema;
