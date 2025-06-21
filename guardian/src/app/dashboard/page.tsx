'use client'

import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  AlertCircle,
  Clock,
  CheckCircle,
  Activity,
  BarChart3,
  Users,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react'
import { DataTable } from '@/components/linear/data-table'
import { ColumnDef } from '@tanstack/react-table'

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon 
}: { 
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: any 
}) {
  const trendColors = {
    up: 'text-success',
    down: 'text-danger',
    neutral: 'text-text-secondary'
  }
  
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-surface p-6 transition-all duration-base hover:border-border-hover hover:shadow-sm">
      {/* Accent strip at top */}
      <div className={`absolute inset-x-0 top-0 h-0.5 ${
        trend === 'up' ? 'bg-success' : trend === 'down' ? 'bg-danger' : 'bg-accent'
      }`} />
      
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-2xl font-semibold text-text-primary">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              <TrendIcon className={`h-4 w-4 ${trend ? trendColors[trend] : ''}`} />
              <span className={`text-xs ${trend ? trendColors[trend] : ''}`}>{change}</span>
            </div>
          )}
        </div>
        <div className="rounded-lg bg-bg-2 p-2">
          <Icon className="h-5 w-5 text-text-tertiary" />
        </div>
      </div>
    </div>
  )
}

// Risk data type
type Risk = {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'in-progress' | 'resolved'
  owner: string
  updated: string
}

// Table columns
const columns: ColumnDef<Risk>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div className="font-medium text-text-primary">{row.getValue('title')}</div>
    ),
  },
  {
    accessorKey: 'severity',
    header: 'Severity',
    cell: ({ row }) => {
      const severity = row.getValue('severity') as string
      const colors = {
        critical: 'bg-danger-subtle text-danger',
        high: 'bg-warning-subtle text-warning',
        medium: 'bg-info-subtle text-info',
        low: 'bg-success-subtle text-success',
      }
      return (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colors[severity as keyof typeof colors]}`}>
          {severity}
        </span>
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
        'in-progress': <Clock className="h-3 w-3" />,
        resolved: <CheckCircle className="h-3 w-3" />,
      }
      return (
        <div className="flex items-center gap-1.5 text-text-secondary">
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
        <div className="h-6 w-6 rounded-full bg-accent-subtle" />
        <span className="text-sm text-text-primary">{row.getValue('owner')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'updated',
    header: 'Updated',
    cell: ({ row }) => (
      <span className="text-sm text-text-tertiary">{row.getValue('updated')}</span>
    ),
  },
]

// Sample data
const risks: Risk[] = [
  { id: '1', title: 'Data breach vulnerability in customer database', severity: 'critical', status: 'open', owner: 'John Doe', updated: '2 hours ago' },
  { id: '2', title: 'Insufficient backup procedures', severity: 'high', status: 'in-progress', owner: 'Jane Smith', updated: '1 day ago' },
  { id: '3', title: 'Outdated security patches on production servers', severity: 'high', status: 'open', owner: 'Mike Johnson', updated: '3 days ago' },
  { id: '4', title: 'Lack of employee security training', severity: 'medium', status: 'resolved', owner: 'Sarah Williams', updated: '1 week ago' },
  { id: '5', title: 'Third-party vendor compliance issues', severity: 'medium', status: 'in-progress', owner: 'Tom Brown', updated: '2 weeks ago' },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-bg-0">
      {/* Page Header */}
      <div className="border-b border-border bg-bg-0 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary">Monitor your organization&apos;s governance, risk, and compliance status</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard 
            title="Open Risks" 
            value="23" 
            change="+12%" 
            trend="up" 
            icon={AlertTriangle}
          />
          <MetricCard 
            title="Active Controls" 
            value="156" 
            change="+5%" 
            trend="up" 
            icon={Shield}
          />
          <MetricCard 
            title="Compliance Score" 
            value="87%" 
            change="-2%" 
            trend="down" 
            icon={TrendingUp}
          />
          <MetricCard 
            title="Open Incidents" 
            value="4" 
            change="-25%" 
            trend="down" 
            icon={AlertCircle}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Risks - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="text-base font-medium text-text-primary">Recent Risks</h2>
                <button className="text-sm text-accent hover:text-accent-hover transition-colors">
                  View all →
                </button>
              </div>
              <div className="p-6">
                <DataTable columns={columns} data={risks} />
              </div>
            </div>
          </div>

          {/* Right Column - Activity & Quick Stats */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="rounded-lg border border-border bg-surface">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-base font-medium text-text-primary">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { icon: AlertTriangle, color: 'text-danger', title: 'New critical risk identified', time: '2 hours ago' },
                    { icon: CheckCircle, color: 'text-success', title: 'Control assessment completed', time: '4 hours ago' },
                    { icon: FileText, color: 'text-info', title: 'Policy document updated', time: '1 day ago' },
                    { icon: Users, color: 'text-warning', title: 'User access review initiated', time: '2 days ago' },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`rounded-lg bg-bg-2 p-2 ${activity.color}`}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm text-text-primary">{activity.title}</p>
                        <p className="text-xs text-text-tertiary">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-lg border border-border bg-surface">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-base font-medium text-text-primary">Risk Distribution</h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: 'Critical', value: 3, color: 'bg-danger', percentage: 13 },
                  { label: 'High', value: 8, color: 'bg-warning', percentage: 35 },
                  { label: 'Medium', value: 9, color: 'bg-info', percentage: 39 },
                  { label: 'Low', value: 3, color: 'bg-success', percentage: 13 },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">{stat.label}</span>
                      <span className="font-medium text-text-primary">{stat.value}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-bg-3">
                      <div 
                        className={`h-2 rounded-full ${stat.color} transition-all duration-slow`}
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="mb-4 text-base font-medium text-text-primary">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: AlertTriangle, label: 'Create Risk', color: 'hover:bg-danger-subtle hover:text-danger' },
              { icon: Shield, label: 'Add Control', color: 'hover:bg-success-subtle hover:text-success' },
              { icon: FileText, label: 'Upload Policy', color: 'hover:bg-info-subtle hover:text-info' },
              { icon: BarChart3, label: 'Generate Report', color: 'hover:bg-accent-subtle hover:text-accent' },
            ].map((action) => (
              <button
                key={action.label}
                className={`flex items-center gap-3 rounded-lg border border-border bg-bg-1 px-4 py-3 text-sm font-medium text-text-primary transition-all hover:border-border-hover ${action.color}`}
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}