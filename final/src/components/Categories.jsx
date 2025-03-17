import React from "react";
import { Link } from "react-router-dom";

const Categories = () => {
  const categories = [
    { name: "Home & Garden", icon: "🏡" },
    { name: "Hair Extensions & Wigs", icon: "💇" },
    { name: "Men's Clothing", icon: "👕" },
    { name: "Accessories", icon: "⌚" },
    { name: "Consumer Electronics", icon: "📷" },
    { name: "Home Improvement & Lighting", icon: "🔧" },
    { name: "Home Appliances", icon: "📺" },
    { name: "Automotive & Motorcycle", icon: "🏍️" },
    { name: "Luggages & Bags", icon: "👜" },
    { name: "Shoes", icon: "👟" },
    { name: "Special Occasion Costume", icon: "🎭" },
    { name: "Women's Clothing", icon: "👗" },
    
  ];

  return (
    <div className="bg-white shadow-md p-4 w-64 rounded-md">
      <h2 className="text-lg font-bold mb-3">All Categories</h2>
      <ul>
        {categories.map((category, index) => (
          <li key={index} className="py-2 hover:text-green-500 transition">
            <Link to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
              {category.icon} {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
