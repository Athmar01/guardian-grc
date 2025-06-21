'use client'

import { 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Filter,
  Search,
  ChevronDown
} from 'lucide-react'

export default function IncidentsPage() {
  return (
    <div className="min-h-screen bg-bg-0">
      {/* Page Header */}
      <div className="border-b border-border bg-bg-0 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-text-primary">Incidents</h1>
            <p className="text-sm text-text-secondary mt-1">Track and manage security incidents</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors">
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">Report Incident</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Incidents</p>
                <p className="text-2xl font-semibold text-text-primary mt-1">0</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-text-tertiary" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Open</p>
                <p className="text-2xl font-semibold text-warning mt-1">0</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">In Progress</p>
                <p className="text-2xl font-semibold text-info mt-1">0</p>
              </div>
              <Clock className="h-8 w-8 text-info" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Resolved</p>
                <p className="text-2xl font-semibold text-success mt-1">0</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
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
                placeholder="Search incidents..."
                className="w-full pl-10 pr-4 py-2 bg-bg-1 border border-border rounded-md text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <button className="flex items-center gap-2 px-3 py-2 bg-bg-1 border border-border rounded-md text-sm text-text-primary hover:bg-bg-2 transition-colors">
                <Filter className="h-4 w-4" />
                <span>All Statuses</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-bg-1 border border-border rounded-md text-sm text-text-primary hover:bg-bg-2 transition-colors">
                <span>All Severities</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-bg-1 border border-border rounded-md text-sm text-text-primary hover:bg-bg-2 transition-colors">
                <span>All Categories</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="rounded-lg border border-border bg-surface p-12">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-text-tertiary" />
            <h3 className="mt-4 text-lg font-medium text-text-primary">No incidents found</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Get started by reporting your first incident.
            </p>
            <button className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors">
              <Plus className="h-4 w-4" />
              <span className="text-sm font-medium">Report Incident</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}