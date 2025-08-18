import {
  ArchiveBoxIcon,
  ChartBarIcon,
  ClipboardTextIcon,
  TruckIcon,
  UsersIcon,
  WarningIcon,
} from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link } from 'react-router-dom';
import { userIsCarrier, userIsLogist } from '@/core/auth/types.ts';
import { useAuthStore } from '@/core/store/authStore.ts';
import { documentService } from '@/features/documents/documentService.ts';
import LoadingSpinner from '@/shared/ui/LoadingSpinner';

interface StatsCardProps {
  change?: {
    value: string;
    trend: 'down' | 'up';
  };
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  value: number | string;
}

const StatsCard: React.FC<StatsCardProps> = ({ change, color, icon: Icon, name, value }) => (
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
              <div
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  change.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.value}
              </div>
            )}
          </dd>
        </dl>
      </div>
    </div>
  </div>
);

interface RecentActivityItem {
  description: string;
  id: string;
  timestamp: string;
  title: string;
  type: 'rate_submitted' | 'rfp_assigned' | 'rfp_completed' | 'rfp_created';
  user: string;
}

const ActivityItem: React.FC<{ activity: RecentActivityItem }> = ({ activity }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'rfp_created':
        return <ClipboardTextIcon className="h-5 w-5 text-blue-500" />;
      case 'rfp_assigned':
        return <TruckIcon className="h-5 w-5 text-green-500" />;
      case 'rfp_completed':
        return <ChartBarIcon className="h-5 w-5 text-purple-500" />;
      case 'rate_submitted':
        return <WarningIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <ClipboardTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-start space-x-3 py-3">
      <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
        <p className="text-sm text-gray-500">{activity.description}</p>
        <p className="text-xs text-gray-400 mt-1">
          {activity.user} • {new Date(activity.timestamp).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const isLogist = userIsLogist(user);
  const isCarrier = userIsCarrier(user);

  // Fetch dashboard stats
  const { data: rfpStats, isLoading: statsLoading } = useQuery({
    queryFn: async () => {
      const response = await documentService.getShipmentRfps({
        page: 0,
        size: 1, // We just need the total count
      });
      return response.page;
    },
    queryKey: ['dashboard-stats'],
  });

  // Mock recent activity - in real app this would come from an API
  const recentActivity: RecentActivityItem[] = [
    {
      description: 'Moscow to St. Petersburg delivery request',
      id: '1',
      timestamp: new Date().toISOString(),
      title: 'New RFP Created',
      type: 'rfp_created',
      user: 'John Logist',
    },
    {
      description: 'Competitive rate for RFP #12345',
      id: '2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      title: 'Rate Submitted',
      type: 'rate_submitted',
      user: 'Transport Co.',
    },
    {
      description: 'Carrier confirmed for delivery',
      id: '3',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      title: 'RFP Assigned',
      type: 'rfp_assigned',
      user: 'System',
    },
  ];

  const stats = [
    {
      change: { trend: 'up' as const, value: '+12%' },
      color: 'bg-blue-500',
      icon: ClipboardTextIcon,
      name: 'Total RFPs',
      value: rfpStats?.totalElements || 0,
    },
    {
      change: { trend: 'up' as const, value: '+5%' },
      color: 'bg-green-500',
      icon: TruckIcon,
      name: 'Active RFPs',
      value: '24',
    },
    {
      change: { trend: 'up' as const, value: '+18%' },
      color: 'bg-purple-500',
      icon: ChartBarIcon,
      name: 'Completed',
      value: '156',
    },
    {
      color: 'bg-orange-500',
      icon: UsersIcon,
      name: isLogist ? 'Carriers' : 'My Organization',
      value: isLogist ? '45' : user?.organization?.name || 'N/A',
    },
  ];

  const quickActions = [
    ...(isLogist
      ? [
          {
            color: 'bg-blue-500',
            description: 'Create new shipment request',
            href: '/shipment-rfps/new',
            icon: ClipboardTextIcon,
            name: 'Create RFP',
          },
        ]
      : []),
    {
      color: 'bg-green-500',
      description: 'Browse all shipment requests',
      href: '/shipment-rfps',
      icon: TruckIcon,
      name: 'View RFPs',
    },
    {
      color: 'bg-purple-500',
      description: 'Update master data',
      href: '/catalogs',
      icon: ArchiveBoxIcon,
      name: 'Manage Catalogs',
    },
  ];

  if (statsLoading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
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
                  to={action.href}
                  key={action.name}
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
                      <Link className="btn-primary text-sm" to="/shipment-rfps?status=ASSIGNED">
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
  );
};

export default DashboardPage;
