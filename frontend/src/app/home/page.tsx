import React from "react";

export default function HomeDashboard() {
  // Example data, replace with real data from your backend or context
  const totalSpent = 245.50;
  const productsBought = 17;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg flex flex-col items-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Mini-market Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-8 w-full justify-center mt-8">
          <div className="flex-1 bg-blue-50 rounded-lg p-6 flex flex-col items-center shadow">
            <span className="text-gray-500 text-lg mb-2">Total Spent</span>
            <span className="text-3xl font-bold text-blue-700">
              ${totalSpent.toFixed(2)}
            </span>
          </div>
          <div className="flex-1 bg-blue-50 rounded-lg p-6 flex flex-col items-center shadow">
            <span className="text-gray-500 text-lg mb-2">Products Bought</span>
            <span className="text-3xl font-bold text-blue-700">
              {productsBought}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}