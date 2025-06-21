'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'; // Assuming a Select component exists

interface AuditSession {
  _id: string;
  title: string;
  status: string;
  auditStartDate: string;
  auditEndDate?: string;
  scopeDescription?: string;
}

interface AuditSessionModalProps {
  complianceId: string;
  session: AuditSession | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuditSessionModal({ complianceId, session, onClose, onSuccess }: AuditSessionModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    status: 'Planned',
    auditStartDate: '',
    auditEndDate: '',
    scopeDescription: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (session) {
      setFormData({
        title: session.title,
        status: session.status,
        auditStartDate: session.auditStartDate ? new Date(session.auditStartDate).toISOString().split('T')[0] : '',
        auditEndDate: session.auditEndDate ? new Date(session.auditEndDate).toISOString().split('T')[0] : '',
        scopeDescription: session.scopeDescription || '',
      });
    } else {
      // Reset for new session form
      setFormData({
        title: '',
        status: 'Planned',
        auditStartDate: new Date().toISOString().split('T')[0],
        auditEndDate: '',
        scopeDescription: '',
      });
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const url = session
      ? `/api/compliance/${complianceId}/audits/${session._id}`
      : `/api/compliance/${complianceId}/audits`;
    const method = session ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save audit session');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving audit session:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold text-primary mb-4">
          {session ? 'Edit Audit Session' : 'New Audit Session'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <Select name="status" value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'Planned' | 'In Progress' | 'Completed' | 'Cancelled' }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planned">Planned</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="auditStartDate" className="block text-sm font-medium text-gray-700">Start Date</label>
              <Input
                id="auditStartDate"
                name="auditStartDate"
                type="date"
                value={formData.auditStartDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="auditEndDate" className="block text-sm font-medium text-gray-700">End Date</label>
              <Input
                id="auditEndDate"
                name="auditEndDate"
                type="date"
                value={formData.auditEndDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="scopeDescription" className="block text-sm font-medium text-gray-700">Scope Description</label>
            <textarea
              id="scopeDescription"
              name="scopeDescription"
              rows={3}
              value={formData.scopeDescription}
              onChange={handleChange}
              className="textarea w-full"
            ></textarea>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Session'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
