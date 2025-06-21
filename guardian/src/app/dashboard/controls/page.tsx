'use client';

import React, { useState, useEffect } from 'react';
import { ControlTable } from '@/components/controls/ControlTable';
import { ControlModal } from '@/components/controls/ControlModal';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'; // Assuming shadcn/ui
import { Control, Folder } from '@prisma/client'; // Using Prisma-generated types

export default function ControlsPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [controls, setControls] = useState<Control[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);

  // Fetch all available folders for the dropdown
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await fetch('/api/folders');
        if (!res.ok) throw new Error('Failed to fetch folders');
        const data: Folder[] = await res.json();
        setFolders(data);
        // Automatically select the first folder if available
        if (data.length > 0) {
          setSelectedFolderId(data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch folders:', error);
      }
    };
    fetchFolders();
  }, []);

  // Fetch controls when a folder is selected
  const fetchControls = async (folderId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/controls?folderId=${folderId}`);
      if (!res.ok) throw new Error('Failed to fetch controls');
      const data: Control[] = await res.json();
      setControls(data);
    } catch (error) {
      console.error('Failed to fetch controls:', error);
      setControls([]); // Clear controls on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFolderId) {
      fetchControls(selectedFolderId);
    }
  }, [selectedFolderId]);

  const handleFolderChange = (folderId: string) => {
    setSelectedFolderId(folderId);
  };

  const handleEdit = (control: Control) => {
    setSelectedControl(control);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedControl(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedControl(null);
  };

  const handleSuccess = () => {
    if (selectedFolderId) {
      fetchControls(selectedFolderId);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Control Library</h1>
        <div className="flex items-center space-x-4">
          <Select onValueChange={handleFolderChange} value={selectedFolderId ?? ''}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a folder" />
            </SelectTrigger>
            <SelectContent>
              {folders.map((folder) => (
                <SelectItem key={folder.id} value={folder.id}>
                  {folder.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddNew} disabled={!selectedFolderId}>
            Add New Control
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10"><p>Loading controls...</p></div>
      ) : (
        <ControlTable
          controls={controls}
          onEdit={handleEdit}
          onRefresh={handleSuccess}
        />
      )}

      {isModalOpen && (
        <ControlModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
          control={selectedControl}
          folderId={selectedFolderId} // Pass folderId for new controls
        />
      )}
    </div>
  );
}
