Here’s a comprehensive guide for using and expanding the **Metadata Creation Tool**:

---

# **Metadata Creation Tool: User and Developer Guide**

This tool is designed to streamline the creation of standardized metadata for NFTs, ensuring consistency and scalability across all types of NFT cards used in the Buberry ecosystem.

---

## **1. Overview**

The Metadata Creation Tool allows users to:
- Input basic metadata attributes (name, description, image URL).
- Select a **card type** (e.g., Land, Tree, Plant Resource).
- Add specific properties dynamically based on the card type's schema.
- Preview the generated metadata in JSON format.
- Upload metadata directly to IPFS (InterPlanetary File System).

---

## **2. How to Use**

### **Step 1: Fill in Basic Metadata**
1. **Name**: Provide a name for the NFT card.
2. **Description**: Add a detailed description of the NFT.
3. **Image URL**: Enter an IPFS URL for the NFT image.

### **Step 2: Select Card Type**
- Choose the card type from the dropdown menu (e.g., Land, Tree, Plant Resource).
- Selecting a card type automatically loads specific fields for that type.

### **Step 3: Fill in Card-Specific Fields**
- Based on the selected card type, additional fields (e.g., biome, fertility, water consumption) will appear.
- Fill in the values for these fields as prompted.

### **Step 4: Generate Metadata**
- Click the **"Generate Metadata"** button to create a preview of the metadata in JSON format.

### **Step 5: Upload Metadata to IPFS**
- If satisfied with the metadata, click the **"Upload to IPFS"** button to store it on IPFS.
- The tool will display a unique IPFS CID (Content Identifier) for the metadata.

---

## **3. Examples**

### **Example 1: Creating Metadata for a Land Card**
1. **Basic Metadata**:
   - Name: "Temperate Meadow Land Card"
   - Description: "A land card with high fertility, ideal for growing trees and plants."
   - Image URL: `https://ipfs.io/ipfs/bafybeibxkc2...`

2. **Card Type**: Select "Land."

3. **Land-Specific Fields**:
   - Biome: "Temperate"
   - Fertility: 8
   - Water Availability: "Abundant"
   - Degradation: 2
   - Capacity:
     - Plots: 5
     - Plant Types Allowed: "Trees"

4. **Generated Metadata**:
```json
{
  "name": "Temperate Meadow Land Card",
  "description": "A land card with high fertility, ideal for growing trees and plants.",
  "image": "https://ipfs.io/ipfs/bafybeibxkc2...",
  "type": "Land",
  "properties": {
    "creator": "Buberry Worldwide",
    "biome": "Temperate",
    "fertility": 8,
    "water_availability": "Abundant",
    "degradation": 2,
    "capacity": {
      "plots": 5,
      "plant_types_allowed": "Trees"
    }
  }
}
```

5. **Upload to IPFS**: Save this metadata with a CID for future reference.

---

## **4. How to Expand the Tool**

### **Step 1: Add a New Card Type**
1. **Update `schemas/cardSchemas.ts`**:
   - Define a new schema for the card type. For example:
```typescript
const toolCardSchema: Schema = {
  type: "Tool",
  fields: [
    { key: "tool_type", label: "Tool Type", type: "select", options: ["Hoe", "Spade", "Watering Can"] },
    { key: "durability", label: "Durability", type: "number", range: { min: 1, max: 100 } },
    { key: "efficiency", label: "Efficiency", type: "number", range: { min: 1, max: 10 } }
  ]
};

const cardSchemas: Record<string, Schema> = {
  ...cardSchemas,
  Tool: toolCardSchema
};
```

2. **Add Fields for the New Card Type**:
   - The tool will dynamically render the fields for the new card type.

---

### **Step 2: Customize Existing Schemas**
- To modify or expand a schema, update its corresponding entry in `schemas/cardSchemas.ts`.
- For example, to add a **weather effect** to Land cards:
```typescript
fields: [
  { key: "weather_effect", label: "Weather Effect", type: "select", options: ["Rainy", "Dry", "Stormy"] },
  ...
]
```

---

### **Step 3: Add New Actions**
- Extend the tool’s functionality to include additional actions like:
  - Linking metadata to smart contracts.
  - Assigning rarity tiers or gameplay mechanics.
- Example:
```typescript
<Button
  variant="contained"
  onClick={() => console.log("Linking metadata to contract...")}
>
  Link Metadata to Contract
</Button>
```

---

## **5. Tips for Scaling**

1. **Standardize Key Names**:
   - Use a consistent naming convention for metadata keys (e.g., snake_case or camelCase).
2. **Test Metadata**:
   - Use tools like JSON validators to ensure the generated metadata conforms to standards.
3. **Backup IPFS Metadata**:
   - Store a copy of the metadata JSON and its CID for traceability.
4. **Integrate with Staking Mechanics**:
   - Add relationships between metadata and staking logic to calculate rewards and resource consumption.

---

## **6. Maintenance and Documentation**

1. **Centralize Updates**:
   - Keep all schemas in `schemas/cardSchemas.ts` for easy updates.
2. **Document New Features**:
   - Maintain a changelog to track modifications and new additions.
3. **Train Users**:
   - Provide examples and guides for users to familiarize themselves with the tool.

---

This guide should enable smooth operation and extensibility for the Metadata Creation Tool. Let me know if you'd like further assistance!
