'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Control } from '@prisma/client';

interface ControlTableProps {
  controls: Control[];
  onEdit: (control: Control) => void;
  onRefresh: () => void;
}

export const ControlTable: React.FC<ControlTableProps> = ({ controls, onEdit, onRefresh }) => {
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this control?')) {
      return;
    }
    try {
      const res = await fetch(`/api/controls/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      onRefresh();
    } catch (error) {
      console.error('Failed to delete control:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effectiveness</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {controls.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No controls found.</td>
            </tr>
          ) : (
            controls.map((control) => (
              <tr key={control.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{control.controlId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{control.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{control.family}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{control.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{control.effectiveness}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="ghost" onClick={() => onEdit(control)}>Edit</Button>
                  <Button variant="destructive" className="ml-2" onClick={() => handleDelete(control.id)}>Delete</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
