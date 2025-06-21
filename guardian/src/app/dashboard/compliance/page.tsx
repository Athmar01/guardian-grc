'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Eye, Edit, Trash2, CheckCircle, XCircle, AlertTriangle, Clock, Shield, FileText, ArrowLeft, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuditSessionManager } from '@/components/compliance/AuditSessionManager';
import { Input } from '@/components/ui/Input';

interface Compliance {
  _id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  status: string;
  complianceLevel: string;
  authority: string;
  jurisdiction: string;
  owner: {
    userId: string;
    userEmail: string;
  };
  requirements: Record<string, unknown>[];
  gaps: Record<string, unknown>[];
  auditSessions: {
    _id: string;
    title: string;
    status: string;
    auditStartDate: string;
    auditEndDate?: string;
    auditor: { userEmail: string; };
    auditFindings: {
      severity: string;
      status: string;
    }[];
  }[];
  lastAssessmentDate?: string;
  nextAssessmentDate?: string;
  tags: string[];
}

export default function CompliancePage() {
  const [compliance, setCompliance] = useState<Compliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComplianceForm, setShowComplianceForm] = useState(false);
  const [selectedCompliance, setSelectedCompliance] = useState<Compliance | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    type: '',
    complianceLevel: '',
    search: ''
  });
  const [view, setView] = useState<'list' | 'dashboard'>('dashboard');

  const fetchCompliance = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/compliance?${params}`);
      const data = await response.json();
      setCompliance(data.compliance || []);
    } catch (error) {
      console.error('Error fetching compliance:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCompliance();
  }, [fetchCompliance]);

  const handleDeleteCompliance = async (complianceId: string) => {
    if (!confirm('Are you sure you want to delete this compliance framework?')) return;

    try {
      const response = await fetch(`/api/compliance/${complianceId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchCompliance();
      }
    } catch (error) {
      console.error('Error deleting compliance:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'Inactive': return <XCircle className="w-4 h-4 text-gray-400" />;
      case 'Under Review': return <Clock className="w-4 h-4 text-amber-600" />;
      case 'Superseded': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getComplianceLevelColor = (level: string) => {
    switch (level) {
      case 'Compliant': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'Partially Compliant': return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Non-Compliant': return 'bg-red-100 text-red-800 border border-red-200';
      case 'Under Assessment': return 'bg-blue-100 text-blue-800 border border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Regulation': return <Shield className="w-4 h-4 text-blue-600" />;
      case 'Standard': return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'Framework': return <CheckCircle className="w-4 h-4 text-purple-600" />;
      case 'Policy': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const calculateComplianceScore = (c: Compliance) => {
    if (!c.requirements || c.requirements.length === 0) return 100;
    const applicable = c.requirements.filter(r => r.status !== 'Not Applicable');
    if (applicable.length === 0) return 100;
    const met = applicable.filter(r => r.status === 'Met').length;
    const partial = applicable.filter(r => r.status === 'Partially Met').length;
    return Math.round(((met + (partial * 0.5)) / applicable.length) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  
  if (selectedCompliance) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedCompliance(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedCompliance.name}</h1>
                <p className="text-gray-600 mt-1">{selectedCompliance.description}</p>
              </div>
            </div>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
                <TabsTrigger value="overview" className="px-4 py-2">Overview</TabsTrigger>
                <TabsTrigger value="audit-sessions" className="px-4 py-2">Audit Sessions</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Framework Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-500">Type</span>
                      <p className="text-gray-900">{selectedCompliance.type}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-500">Category</span>
                      <p className="text-gray-900">{selectedCompliance.category}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <p className="text-gray-900">{selectedCompliance.status}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-500">Compliance Level</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getComplianceLevelColor(selectedCompliance.complianceLevel)}`}>
                        {selectedCompliance.complianceLevel}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-500">Authority</span>
                      <p className="text-gray-900">{selectedCompliance.authority}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-500">Jurisdiction</span>
                      <p className="text-gray-900">{selectedCompliance.jurisdiction}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="audit-sessions" className="mt-6">
                <AuditSessionManager
                  complianceId={selectedCompliance._id}
                  sessions={selectedCompliance.auditSessions}
                  onSessionsUpdate={fetchCompliance}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">
                Compliance Management
              </h1>
              <p className="text-lg text-gray-600">
                Track and manage regulatory compliance frameworks across your organization
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => setShowComplianceForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a365d] text-white rounded-lg text-sm font-medium hover:bg-[#15294a] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add Framework
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="flex items-center text-sm font-medium text-emerald-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  2.3%
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Frameworks</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">{compliance.length}</p>
              <p className="text-sm text-gray-500">Active compliance frameworks</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="flex items-center text-sm font-medium text-emerald-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  8.1%
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Compliant</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">{compliance.filter(c => c.complianceLevel === 'Compliant').length}</p>
              <p className="text-sm text-gray-500">Fully compliant frameworks</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex items-center text-sm font-medium text-red-600">
                  <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
                  3.2%
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Open Gaps</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">{compliance.reduce((total, c) => total + (c.gaps?.filter(g => g.status !== 'Closed').length || 0), 0)}</p>
              <p className="text-sm text-gray-500">Compliance gaps requiring attention</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-red-50 text-red-600">
                  <XCircle className="w-6 h-6" />
                </div>
                <div className="flex items-center text-sm font-medium text-amber-600">
                  <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
                  1.5%
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Critical Findings</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">{compliance.reduce((total, c) => total + (c.auditSessions?.reduce((sTotal, s) => sTotal + (s.auditFindings?.filter(f => f.severity === 'Critical' && f.status !== 'Closed').length || 0), 0) || 0), 0)}</p>
              <p className="text-sm text-gray-500">Critical audit findings</p>
            </div>
          </div>

          {/* Filters and View Toggle */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-3 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search frameworks..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex-1 md:w-64"
                />
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Under Review">Under Review</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView('dashboard')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    view === 'dashboard'
                      ? 'bg-[#1a365d] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    view === 'list'
                      ? 'bg-[#1a365d] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          {view === 'dashboard' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {compliance.map((framework) => (
                <div key={framework._id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(framework.type)}
                      <span className="text-sm font-medium text-gray-600">{framework.type}</span>
                    </div>
                    {getStatusIcon(framework.status)}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{framework.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{framework.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Compliance Score:</span>
                      <span className={`text-sm font-semibold ${getScoreColor(calculateComplianceScore(framework))}`}>
                        {calculateComplianceScore(framework)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Open Gaps:</span>
                      <span className="text-sm font-semibold text-amber-600">
                        {framework.gaps?.filter(g => g.status !== 'Closed').length || 0}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getComplianceLevelColor(framework.complianceLevel)}`}>
                        {framework.complianceLevel}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedCompliance(framework)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCompliance(framework);
                            setShowComplianceForm(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Level</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Score</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Owner</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {compliance.map((framework) => (
                      <tr key={framework._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{framework.name}</div>
                            <div className="text-sm text-gray-600 truncate max-w-xs">{framework.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(framework.type)}
                            <span className="text-sm text-gray-700">{framework.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(framework.status)}
                            <span className="text-sm text-gray-700">{framework.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getComplianceLevelColor(framework.complianceLevel)}`}>
                            {framework.complianceLevel}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-semibold ${getScoreColor(calculateComplianceScore(framework))}`}>
                            {calculateComplianceScore(framework)}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">{framework.owner.userEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedCompliance(framework)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCompliance(framework);
                                setShowComplianceForm(true);
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCompliance(framework._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Modal */}
          {showComplianceForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl border border-gray-200 w-full max-w-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedCompliance ? 'Edit' : 'Add'} Framework
                </h2>
                <p className="text-gray-600 mb-6">Compliance form component will be implemented here.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      fetchCompliance();
                      setShowComplianceForm(false);
                      setSelectedCompliance(null);
                    }}
                    className="px-4 py-2 bg-[#1a365d] text-white rounded-lg text-sm font-medium hover:bg-[#15294a] transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowComplianceForm(false);
                      setSelectedCompliance(null);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}