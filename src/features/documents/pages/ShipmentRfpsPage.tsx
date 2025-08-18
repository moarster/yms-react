// noinspection t

import { PlusIcon, TruckIcon } from '@phosphor-icons/react';

import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { userIsCarrier, userIsLogist } from '@/core/auth/types.ts';
import { useAuthStore } from '@/core/store/authStore.ts';
import { documentService } from '@/features/documents/documentService.ts';
import { ShipmentRfp, ShipmentRfpData } from '@/features/documents/types/shipment-rfp.ts';
import { schemaService } from '@/services/schemaService.ts';
import { DataGridTable } from '@/shared/ui/DataGridTable';
import { BaseTableRow } from '@/shared/ui/DataGridTable/table.types.ts';
import ErrorMessage from '@/shared/ui/ErrorMessage.tsx';
import LoadingSpinner from '@/shared/ui/LoadingSpinner.tsx';
import { DocumentStatus } from '@/types';

interface StatusFilterProps {
  onStatusChange: (statuses: DocumentStatus[]) => void;
  selectedStatuses: DocumentStatus[];
}

const StatusFilter: React.FC<StatusFilterProps> = ({ onStatusChange, selectedStatuses }) => {
  const statuses: { value: DocumentStatus; label: string; color: string }[] = [
    { color: 'gray', label: 'Draft', value: 'NEW' },
    { color: 'blue', label: 'Assigned', value: 'ASSIGNED' },
    { color: 'green', label: 'Completed', value: 'COMPLETED' },
    { color: 'red', label: 'Cancelled', value: 'CANCELLED' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <button
          className={clsx(
            'px-3 py-1.5 text-sm font-medium rounded-full border transition-colors duration-200',
            selectedStatuses.includes(status.value)
              ? 'bg-primary-100 text-primary-800 border-primary-300'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
          )}
          key={status.value}
          onClick={() => {
            if (selectedStatuses.includes(status.value)) {
              onStatusChange(selectedStatuses.filter((s) => s !== status.value));
            } else {
              onStatusChange([...selectedStatuses, status.value]);
            }
          }}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
};

interface ShipmentRfpRow extends BaseTableRow, ShipmentRfpData {}
const ShipmentRfpsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();
  const isLogist = userIsLogist(user);
  const isCarrier = userIsCarrier(user);

  const [selectedStatuses, setSelectedStatuses] = useState<DocumentStatus[]>(
    (searchParams.get('status')?.split(',') as DocumentStatus[]) || [],
  );
  const [_selectedRfps, setSelectedRfps] = useState<ShipmentRfp[]>([]);

  // Fetch shipment RFP schema
  const { data: schema, isLoading: schemaLoading } = useQuery({
    queryFn: async () => {
      return await schemaService.getAnySchema('shipment-rfp');
    },
    queryKey: ['shipment-rfp-schema'],
  });

  // Fetch RFPs with filters
  const {
    data: rfpsData,
    error,
    isLoading: rfpsLoading,
  } = useQuery({
    queryFn: async () => {
      return await documentService.getShipmentRfps({
        page: 0,
        size: 50,
        status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      });
    },
    queryKey: ['shipment-rfps', selectedStatuses],
  });

  // Handle status filter changes
  const handleStatusChange = (statuses: DocumentStatus[]) => {
    setSelectedStatuses(statuses);
    if (statuses.length > 0) {
      setSearchParams({ status: statuses.join(',') });
    } else {
      setSearchParams({});
    }
  };

  const handleSelectionChange = (selectedRows: ShipmentRfp[]) => {
    setSelectedRfps(selectedRows);
  };

  const handleRowClick = (rfp: ShipmentRfp) => {
    navigate(`/shipment-rfps/${rfp.id}`);
  };

  const isLoading = schemaLoading || rfpsLoading;

  if (error) {
    return <ErrorMessage message="Failed to load shipment RFPs" />;
  }

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading shipment RFPs..." />;
  }

  if (!schema) {
    return <ErrorMessage message="Schema not available" />;
  }

  const rfps =
    rfpsData?.content?.map((item) => ({
      ...(item.data || {}),
      id: item.id,
      status: item.status,
    })) || [];
  const stats = [
    {
      color: 'text-blue-600',
      icon: TruckIcon,
      name: 'Total RFPs',
      value: rfpsData?.page.totalPages || 0,
    },
    {
      color: 'text-gray-600',
      icon: TruckIcon,
      name: 'Draft',
      value: rfpsData?.content.filter((r) => r.status === 'NEW').length,
    },
    {
      color: 'text-blue-600',
      icon: TruckIcon,
      name: 'Assigned',
      value: rfpsData?.content.filter((r) => r.status === 'ASSIGNED').length,
    },
    {
      color: 'text-green-600',
      icon: TruckIcon,
      name: 'Completed',
      value: rfpsData?.content.filter((r) => r.status === 'CLOSED').length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipment RFPs</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isLogist
              ? 'Manage shipment requests and track their progress'
              : 'View and respond to shipment requests assigned to your organization'}
          </p>
        </div>

        {
          <div className="flex space-x-3">
            <Link className="btn-primary" to="/shipment-rfps/new">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create RFP
            </Link>
          </div>
        }
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="ml-5">
                <div className="text-sm font-medium text-gray-500">{stat.name}</div>
                <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          <button
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={() => handleStatusChange([])}
          >
            Clear all
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <StatusFilter selectedStatuses={selectedStatuses} onStatusChange={handleStatusChange} />
          </div>
        </div>
      </div>

      {/* RFPs Auto-generated Table */}
      <div className="card p-0 overflow-hidden">
        <DataGridTable<ShipmentRfpRow>
          config={{
            filterable: true,
            height: '70vh',
            pageSize: rfpsData?.page.size,
            pagination: true,
            selectable: isLogist,
            sortable: true,
          }}
          data={rfps}
          schema={schema}
          loading={isLoading}
          enableInlineEdit={false}
          onRowClick={handleRowClick}
          onSelectionChange={handleSelectionChange}
        />
      </div>

      {/* Empty state for carriers */}
      {isCarrier && rfps.length === 0 && (
        <div className="text-center py-12">
          <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No RFPs assigned</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any shipment requests assigned to your organization yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShipmentRfpsPage;
