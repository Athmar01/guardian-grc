'use client'

import { useState } from 'react'
import { DataTable } from '@/components/linear/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { 
  AlertTriangle,
  Filter,
  Plus,
  Search,
  Calendar,
  User,
  Building,
  TrendingUp,
  ChevronDown,
  MoreHorizontal,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Shield
} from 'lucide-react'

// Risk data type
type Risk = {
  id: string
  title: string
  description: string
  category: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  likelihood: 'very-high' | 'high' | 'medium' | 'low' | 'very-low'
  status: 'open' | 'in-review' | 'mitigating' | 'closed'
  owner: string
  department: string
  dateIdentified: string
  lastReviewed: string
  residualRisk: number
  inherentRisk: number
}

// Table columns
const columns: ColumnDef<Risk>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <div className="font-mono text-xs text-text-secondary">{row.getValue('id')}</div>
    ),
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div className="max-w-[400px]">
        <div className="font-medium text-text-primary truncate">{row.getValue('title')}</div>
        <div className="text-xs text-text-tertiary truncate">{row.original.description}</div>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <div className="inline-flex items-center rounded-full bg-bg-2 px-2.5 py-1 text-xs font-medium text-text-secondary">
        {row.getValue('category')}
      </div>
    ),
  },
  {
    accessorKey: 'severity',
    header: 'Severity',
    cell: ({ row }) => {
      const severity = row.getValue('severity') as string
      const colors = {
        critical: 'bg-danger-subtle text-danger border-danger/20',
        high: 'bg-warning-subtle text-warning border-warning/20',
        medium: 'bg-info-subtle text-info border-info/20',
        low: 'bg-success-subtle text-success border-success/20',
      }
      return (
        <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${colors[severity as keyof typeof colors]}`}>
          {severity}
        </span>
      )
    },
  },
  {
    accessorKey: 'likelihood',
    header: 'Likelihood',
    cell: ({ row }) => {
      const likelihood = row.getValue('likelihood') as string
      return (
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i <= (likelihood === 'very-low' ? 1 : likelihood === 'low' ? 2 : likelihood === 'medium' ? 3 : likelihood === 'high' ? 4 : 5)
                    ? 'bg-accent'
                    : 'bg-bg-3'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-text-secondary capitalize">{likelihood.replace('-', ' ')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const icons = {
        open: <AlertCircle className="h-3 w-3" />,
        'in-review': <Clock className="h-3 w-3" />,
        mitigating: <Shield className="h-3 w-3" />,
        closed: <CheckCircle className="h-3 w-3" />,
      }
      const colors = {
        open: 'text-danger',
        'in-review': 'text-warning',
        mitigating: 'text-info',
        closed: 'text-success',
      }
      return (
        <div className={`flex items-center gap-1.5 ${colors[status as keyof typeof colors]}`}>
          {icons[status as keyof typeof icons]}
          <span className="text-sm capitalize">{status.replace('-', ' ')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'owner',
    header: 'Owner',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-accent-subtle flex items-center justify-center">
          <span className="text-[10px] font-medium text-accent">
            {row.getValue<string>('owner').split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <span className="text-sm text-text-primary">{row.getValue('owner')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'inherentRisk',
    header: 'Risk Score',
    cell: ({ row }) => {
      const inherent = row.getValue('inherentRisk') as number
      const residual = row.original.residualRisk
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-tertiary">Inherent:</span>
            <span className="font-medium text-text-primary">{inherent}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-tertiary">Residual:</span>
            <span className="font-medium text-text-primary">{residual}</span>
            {residual < inherent && (
              <span className="text-xs text-success">-{inherent - residual}</span>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'lastReviewed',
    header: 'Last Reviewed',
    cell: ({ row }) => (
      <span className="text-sm text-text-tertiary">{row.getValue('lastReviewed')}</span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <button className="p-1 hover:bg-bg-2 rounded-md transition-colors">
        <MoreHorizontal className="h-4 w-4 text-text-tertiary" />
      </button>
    ),
  },
]

// Sample data
const risks: Risk[] = [
  {
    id: 'RISK-2024-001',
    title: 'Data breach vulnerability in customer database',
    description: 'Unpatched SQL injection vulnerability discovered in production environment',
    category: 'Cybersecurity',
    severity: 'critical',
    likelihood: 'high',
    status: 'mitigating',
    owner: 'John Doe',
    department: 'IT Security',
    dateIdentified: '2024-01-15',
    lastReviewed: '2 hours ago',
    residualRisk: 16,
    inherentRisk: 20,
  },
  {
    id: 'RISK-2024-002',
    title: 'Insufficient backup procedures',
    description: 'Current backup strategy does not meet RTO/RPO requirements',
    category: 'Operational',
    severity: 'high',
    likelihood: 'medium',
    status: 'in-review',
    owner: 'Jane Smith',
    department: 'IT Operations',
    dateIdentified: '2024-01-20',
    lastReviewed: '1 day ago',
    residualRisk: 12,
    inherentRisk: 15,
  },
  {
    id: 'RISK-2024-003',
    title: 'Third-party vendor compliance',
    description: 'Key vendor has not completed required security assessments',
    category: 'Compliance',
    severity: 'medium',
    likelihood: 'low',
    status: 'open',
    owner: 'Mike Johnson',
    department: 'Procurement',
    dateIdentified: '2024-02-01',
    lastReviewed: '3 days ago',
    residualRisk: 8,
    inherentRisk: 10,
  },
  {
    id: 'RISK-2024-004',
    title: 'Lack of employee security training',
    description: 'Only 60% of employees have completed mandatory security awareness training',
    category: 'Human Resources',
    severity: 'medium',
    likelihood: 'high',
    status: 'mitigating',
    owner: 'Sarah Williams',
    department: 'HR',
    dateIdentified: '2024-01-10',
    lastReviewed: '1 week ago',
    residualRisk: 9,
    inherentRisk: 12,
  },
  {
    id: 'RISK-2024-005',
    title: 'Regulatory compliance gap',
    description: 'New data privacy regulations require additional controls',
    category: 'Compliance',
    severity: 'high',
    likelihood: 'very-high',
    status: 'in-review',
    owner: 'Tom Brown',
    department: 'Legal',
    dateIdentified: '2024-02-05',
    lastReviewed: '2 days ago',
    residualRisk: 18,
    inherentRisk: 20,
  },
]

// Filter options
const severityOptions = ['All', 'Critical', 'High', 'Medium', 'Low']
const statusOptions = ['All', 'Open', 'In Review', 'Mitigating', 'Closed']
const categoryOptions = ['All', 'Cybersecurity', 'Operational', 'Compliance', 'Financial', 'Human Resources']

export default function RisksPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Stats calculation
  const stats = {
    total: risks.length,
    critical: risks.filter(r => r.severity === 'critical').length,
    high: risks.filter(r => r.severity === 'high').length,
    open: risks.filter(r => r.status === 'open').length,
    avgResidual: Math.round(risks.reduce((acc, r) => acc + r.residualRisk, 0) / risks.length),
  }

  return (
    <div className="min-h-screen bg-bg-0">
      {/* Page Header */}
      <div className="border-b border-border bg-bg-0 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-text-primary">Risk Register</h1>
            <p className="text-sm text-text-secondary mt-1">Track and manage organizational risks</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors">
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">Add Risk</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Risks</p>
                <p className="text-2xl font-semibold text-text-primary mt-1">{stats.total}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-text-tertiary" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Critical</p>
                <p className="text-2xl font-semibold text-danger mt-1">{stats.critical}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-danger" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">High</p>
                <p className="text-2xl font-semibold text-warning mt-1">{stats.high}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Open</p>
                <p className="text-2xl font-semibold text-info mt-1">{stats.open}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-info" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Avg Residual</p>
                <p className="text-2xl font-semibold text-text-primary mt-1">{stats.avgResidual}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-text-tertiary" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search risks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-bg-1 border border-border rounded-md text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Severity Filter */}
              <div className="relative">
                <button className="flex items-center gap-2 px-3 py-2 bg-bg-1 border border-border rounded-md text-sm text-text-primary hover:bg-bg-2 transition-colors">
                  <Filter className="h-4 w-4" />
                  <span>Severity: {selectedSeverity}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <button className="flex items-center gap-2 px-3 py-2 bg-bg-1 border border-border rounded-md text-sm text-text-primary hover:bg-bg-2 transition-colors">
                  <span>Status: {selectedStatus}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="relative">
                <button className="flex items-center gap-2 px-3 py-2 bg-bg-1 border border-border rounded-md text-sm text-text-primary hover:bg-bg-2 transition-colors">
                  <span>Category: {selectedCategory}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Table */}
        <div className="rounded-lg border border-border bg-surface">
          <div className="p-6">
            <DataTable columns={columns} data={risks} />
          </div>
        </div>
      </div>
    </div>
  )
}