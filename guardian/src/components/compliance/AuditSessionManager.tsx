'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
// We will create this modal in the next step
import { AuditSessionModal } from './AuditSessionModal'; 

interface AuditSession {
  _id: string;
  title: string;
  status: string;
  auditStartDate: string;
  auditEndDate?: string;
  auditor: { userEmail: string; };
}

interface AuditSessionManagerProps {
  complianceId: string;
  sessions: AuditSession[];
  onSessionsUpdate: () => void;
}

export function AuditSessionManager({ complianceId, sessions, onSessionsUpdate }: AuditSessionManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<AuditSession | null>(null);

  const handleEdit = (session: AuditSession) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleDelete = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this audit session?')) return;

    try {
      await fetch(`/api/compliance/${complianceId}/audits/${sessionId}`, { method: 'DELETE' });
      onSessionsUpdate();
    } catch (error) {
      console.error('Failed to delete audit session:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Audit Sessions</h3>
        <Button onClick={() => {
          setSelectedSession(null);
          setIsModalOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          New Audit Session
        </Button>
      </div>

      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auditor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sessions.map((session) => (
              <tr key={session._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{session.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.auditor.userEmail}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(session.auditStartDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(session)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(session._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AuditSessionModal
          complianceId={complianceId}
          session={selectedSession}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            onSessionsUpdate();
          }}
        />
      )}
    </div>
  );
}
