import {
    ArchiveBoxIcon,
    ChartBarIcon,
    ClipboardDocumentListIcon,
    ExclamationTriangleIcon,
    TruckIcon,
    UsersIcon} from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Link } from 'react-router-dom'

import { authService } from '@/core/auth/authService.ts'
import {userIsCarrier, userIsLogist} from "@/core/auth/types.ts";
import { useAuthStore } from '@/core/store/authStore.ts'
import { documentService } from '@/features/documents/documentService.ts'
import LoadingSpinner from '@/shared/ui/LoadingSpinner'

interface StatsCardProps {
    name: string
    value: string | number
    icon: React.ComponentType<{ className?: string }>
    color: string
    change?: {
        value: string
        trend: 'up' | 'down'
    }
}

const StatsCard: React.FC<StatsCardProps> = ({ name, value, icon: Icon, color, change }) => (
    <div className="card p-6">
        <div className="flex items-center">
            <div className="flex-shrink-0">
                <div className={`p-3 rounded-md ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
            <div className="ml-5 w-0 flex-1">
                <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{name}</dt>
                    <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{value}</div>
                        {change && (
                            <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                                change.trend === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {change.value}
                            </div>
                        )}
                    </dd>
                </dl>
            </div>
        </div>
    </div>
)

interface RecentActivityItem {
    id: string
    type: 'rfp_created' | 'rfp_assigned' | 'rfp_completed' | 'rate_submitted'
    title: string
    description: string
    timestamp: string
    user: string
}

const ActivityItem: React.FC<{ activity: RecentActivityItem }> = ({ activity }) => {
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'rfp_created':
                return <ClipboardDocumentListIcon className="h-5 w-5 text-blue-500" />
            case 'rfp_assigned':
                return <TruckIcon className="h-5 w-5 text-green-500" />
            case 'rfp_completed':
                return <ChartBarIcon className="h-5 w-5 text-purple-500" />
            case 'rate_submitted':
                return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
            default:
                return <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" />
        }
    }

    return (
        <div className="flex items-start space-x-3 py-3">
            <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                    {activity.user} • {new Date(activity.timestamp).toLocaleDateString()}
                </p>
            </div>
        </div>
    )
}

const DashboardPage: React.FC = () => {
    const { user } = useAuthStore()
    const isLogist = userIsLogist(user)
    const isCarrier = userIsCarrier(user)

    // Fetch dashboard stats
    const { data: rfpStats, isLoading: statsLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const response = await documentService.getShipmentRfps({
                page: 0,
                size: 1 // We just need the total count
            })
            return response.page
        },
    })

    // Mock recent activity - in real app this would come from an API
    const recentActivity: RecentActivityItem[] = [
        {
            id: '1',
            type: 'rfp_created',
            title: 'New RFP Created',
            description: 'Moscow to St. Petersburg delivery request',
            timestamp: new Date().toISOString(),
            user: 'John Logist'
        },
        {
            id: '2',
            type: 'rate_submitted',
            title: 'Rate Submitted',
            description: 'Competitive rate for RFP #12345',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            user: 'Transport Co.'
        },
        {
            id: '3',
            type: 'rfp_assigned',
            title: 'RFP Assigned',
            description: 'Carrier confirmed for delivery',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            user: 'System'
        }
    ]

    const stats = [
        {
            name: 'Total RFPs',
            value: rfpStats?.totalElements || 0,
            icon: ClipboardDocumentListIcon,
            color: 'bg-blue-500',
            change: { value: '+12%', trend: 'up' as const }
        },
        {
            name: 'Active RFPs',
            value: '24',
            icon: TruckIcon,
            color: 'bg-green-500',
            change: { value: '+5%', trend: 'up' as const }
        },
        {
            name: 'Completed',
            value: '156',
            icon: ChartBarIcon,
            color: 'bg-purple-500',
            change: { value: '+18%', trend: 'up' as const }
        },
        {
            name: isLogist ? 'Carriers' : 'My Organization',
            value: isLogist ? '45' : user?.organization?.name || 'N/A',
            icon: UsersIcon,
            color: 'bg-orange-500',
        }
    ]

    const quickActions = [
        ...(isLogist ? [{
            name: 'Create RFP',
            description: 'Create new shipment request',
            href: '/shipment-rfps/new',
            icon: ClipboardDocumentListIcon,
            color: 'bg-blue-500'
        }] : []),
        {
            name: 'View RFPs',
            description: 'Browse all shipment requests',
            href: '/shipment-rfps',
            icon: TruckIcon,
            color: 'bg-green-500'
        },
        {
            name: 'Manage Catalogs',
            description: 'Update master data',
            href: '/catalogs',
            icon: ArchiveBoxIcon,
            color: 'bg-purple-500'
        }
    ]

    if (statsLoading) {
        return <LoadingSpinner size="lg" text="Loading dashboard..." />
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Welcome back, {user?.name}! Here's what's happening with your shipments.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <StatsCard key={stat.name} {...stat} />
                ))}
            </div>

            {/* Quick actions and recent activity */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Quick actions */}
                <div className="card">
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            {quickActions.map((action) => (
                                <Link
                                    key={action.name}
                                    to={action.href}
                                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <div className={`p-2 rounded-md ${action.color}`}>
                                        <action.icon className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">{action.name}</p>
                                        <p className="text-sm text-gray-500">{action.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent activity */}
                <div className="card">
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-1">
                            {recentActivity.map((activity) => (
                                <ActivityItem key={activity.id} activity={activity} />
                            ))}
                        </div>
                        <div className="mt-4">
                            <Link
                                to="/activity"
                                className="text-sm font-medium text-primary-600 hover:text-primary-500"
                            >
                                View all activity →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Role-specific section */}
            {isCarrier && (
                <div className="card">
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Carrier Dashboard</h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <TruckIcon className="h-5 w-5 text-blue-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        Organization: {user?.organization?.name}
                                    </h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <p>You can view and respond to RFPs assigned to your organization.</p>
                                    </div>
                                    <div className="mt-4">
                                        <div className="-mx-2 -my-1.5 flex">
                                            <Link
                                                to="/shipment-rfps?status=ASSIGNED"
                                                className="btn-primary text-sm"
                                            >
                                                View Assigned RFPs
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DashboardPage