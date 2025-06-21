'use client';

import React from 'react';

// TODO: Fetch risk matrices from the API
const mockMatrices = [
  { id: '1', name: 'Default Organizational Risk Matrix', description: 'Standard 5x5 matrix for assessing organizational risks.' },
  { id: '2', name: 'Cybersecurity Risk Matrix', description: 'A specialized matrix for IT and cybersecurity threats.' },
];

export default function RiskMatricesPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Risk Matrix Management</h1>
      
      <div className="mb-6">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          + Create New Matrix
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockMatrices.map((matrix) => (
              <tr key={matrix.id}>
                <td className="px-6 py-4 whitespace-nowrap">{matrix.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{matrix.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">Edit</a>
                  <a href="#" className="text-red-600 hover:text-red-900 ml-4">Delete</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
