import React, { useState } from "react";
import "./Sidebar.css";

const initialCategories = [
  {
    name: "All NFTs",
    children: [],
  },
  {
    name: "Game Items",
    children: [
      { name: "Weapons" },
      { name: "Armor" },
      { name: "Potions" },
    ],
  },
  {
    name: "Art",
    children: [
      { name: "Abstract" },
      { name: "Portraits" },
      { name: "Landscapes" },
    ],
  },
  {
    name: "Collectibles",
    children: [
      { name: "Limited Edition" },
      { name: "Series 1" },
      { name: "Series 2" },
    ],
  },
];

export const Sidebar: React.FC<{ onCategorySelect: (category: string) => void }> = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryClick = (categoryName: string) => {
    onCategorySelect(categoryName);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCategoryTree = (categories: any[]) => {
    return (
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            <span
              className="category"
              onClick={() => handleCategoryClick(category.name)}
            >
              {category.name}
            </span>
            {category.children && category.children.length > 0 && (
              <div className="subcategories">
                {renderCategoryTree(category.children)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="sidebar">
      <input
        type="text"
        placeholder="Search NFTs..."
        className="search-bar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="category-tree">{renderCategoryTree(filteredCategories)}</div>
    </div>
  );
};
