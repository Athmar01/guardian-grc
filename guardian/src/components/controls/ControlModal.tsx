'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Control, ControlStatus } from '@prisma/client';

interface ControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  control: Control | null;
  folderId: string | null;
}

const initialFormData: Omit<Control, 'id' | 'createdAt' | 'updatedAt' | 'metadata' | 'ownerId' | 'referenceControlId'> = {
  controlId: '',
  name: '',
  description: '',
  family: '',
  status: ControlStatus.DRAFT,
  effectiveness: 0,
  folderId: '',
};

export const ControlModal: React.FC<ControlModalProps> = ({ isOpen, onClose, onSuccess, control, folderId }) => {
  const [formData, setFormData] = useState<Partial<Control>>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (control) {
        setFormData(control);
      } else {
        setFormData({ ...initialFormData, folderId: folderId ?? '' });
      }
    }
  }, [control, isOpen, folderId]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseInt(value, 10) || 0 : value;
    setFormData((prev: Partial<Control>) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: Partial<Control>) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.folderId) {
        setError('Folder ID is missing.');
        return;
    }
    setIsSubmitting(true);
    setError(null);

    const url = control?.id ? `/api/controls/${control.id}` : '/api/controls';
    const method = control?.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save control');
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Submission failed:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">{control?.id ? 'Edit Control' : 'Add New Control'}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="controlId">Control ID</Label>
              <Input id="controlId" name="controlId" value={formData.controlId ?? ''} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name ?? ''} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="family">Family</Label>
              <Input id="family" name="family" value={formData.family ?? ''} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ControlStatus).map((status: ControlStatus) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div>
              <Label htmlFor="effectiveness">Effectiveness (0-100)</Label>
              <Input id="effectiveness" name="effectiveness" type="number" value={formData.effectiveness ?? 0} onChange={handleChange} />
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description ?? ''} onChange={handleChange} />
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Control'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
