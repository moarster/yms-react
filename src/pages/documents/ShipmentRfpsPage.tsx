import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import {
    PlusIcon,
    EyeIcon,
    CalendarIcon,
    TruckIcon,
    MapPinIcon
} from '@heroicons/react/24/outline'
import { documentService } from '@/services/documentService'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import { ShipmentRfp, DocumentStatus } from '@/types'
import DataTable from '@/components/ui/DataTable'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import StatusBadge from '@/components/ui/StatusBadge'
import { format } from 'date-fns'
import clsx from 'clsx'

interface StatusFilterProps {
    selectedStatuses: DocumentStatus[]
    onStatusChange: (statuses: DocumentStatus[]) => void
}

const StatusFilter: React.FC<StatusFilterProps> = ({ selectedStatuses, onStatusChange }) => {
    const statuses: { value: DocumentStatus; label: string; color: string }[] = [
        { value: 'DRAFT', label: 'Draft', color: 'gray' },
        { value: 'ASSIGNED', label: 'Assigned', color: 'blue' },
        { value: 'COMPLETED', label: 'Completed', color: 'green' },
        { value: 'CANCELLED', label: 'Cancelled', color: 'red' },
    ]

    return (
        <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
                <button
                    key={status.value}
                    onClick={() => {
                        if (selectedStatuses.includes(status.value)) {
                            onStatusChange(selectedStatuses.filter(s => s !== status.value))
                        } else {
                            onStatusChange([...selectedStatuses, status.value])
                        }
                    }}
                    className={clsx(
                        'px-3 py-1.5 text-sm font-medium rounded-full border transition-colors duration-200',
                        selectedStatuses.includes(status.value)
                            ? 'bg-primary-100 text-primary-800 border-primary-300'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    )}
                >
                    {status.label}
                </button>
            ))}
        </div>
    )
}

const ShipmentRfpsPage: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const { user } = useAuthStore()
    const isLogist = authService.isLogist(user)
    const isCarrier = authService.isCarrier(user)

    const [selectedStatuses, setSelectedStatuses] = useState<DocumentStatus[]>(
        searchParams.get('status')?.split(',') as DocumentStatus[] || []
    )

    // Fetch RFPs with filters
    const { data: rfpsData, isLoading, error } = useQuery({
        queryKey: ['shipment-rfps', selectedStatuses],
        queryFn: async () => {
            const response = await documentService.getShipmentRfps({
                page: 0,
                size: 50,
                status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
            })
            return response.data
        },
    })

    // Handle status filter changes
    const handleStatusChange = (statuses: DocumentStatus[]) => {
        setSelectedStatuses(statuses)
        if (statuses.length > 0) {
            setSearchParams({ status: statuses.join(',') })
        } else {
            setSearchParams({})
        }
    }

    // Table columns
    const columns: ColumnDef<ShipmentRfp>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => (
                <div className="font-mono text-sm text-gray-600">
                    #{row.original.id.slice(-8)}
                </div>
            ),
        },
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => (
                <div>
                    <div className="font-medium text-gray-900">{row.original.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                        {row.original.title}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => <StatusBadge status={row.original.status} />,
        },
        {
            id: 'route',
            header: 'Route',
            cell: ({ row }) => (
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4" />
                    <span className="truncate max-w-24">{row.original.pickupLocation.address}</span>
                    <span>→</span>
                    <span className="truncate max-w-24">{row.original.deliveryLocation.address}</span>
                </div>
            ),
        },
        {
            id: 'timeline',
            header: 'Pickup Date',
            cell: ({ row }) => (
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{format(new Date(row.original.timeline.pickupDate), 'MMM dd, yyyy')}</span>
                </div>
            ),
        },
        {
            id: 'cargo',
            header: 'Cargo',
            cell: ({ row }) => (
                <div className="text-sm text-gray-600">
                    <div>{row.original.cargoDetails.weight} kg</div>
                    <div className="text-xs text-gray-500">{row.original.cargoDetails.cargoType}</div>
                </div>
            ),
        },
        {
            accessorKey: 'carrier',
            header: 'Carrier',
            cell: ({ row }) => (
                <div className="text-sm text-gray-600">
                    {row.original.data._carrier?.title || (
                        <span className="text-gray-400 italic">Not assigned</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Created',
            cell: ({ row }) => (
                <div className="text-sm text-gray-500">
                    {format(new Date(row.original.createdDate), 'MMM dd, yyyy')}
                </div>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/shipment-rfps/${row.original.id}`)
                        }}
                        className="text-primary-600 hover:text-primary-900"
                        title="View Details"
                    >
                        <EyeIcon className="h-4 w-4" />
                    </button>
                </div>
            ),
            enableSorting: false,
        },
    ]

    // Filter columns based on user role
    const filteredColumns = columns.filter(col => {
        if (isCarrier && col.id === 'carrier') {
            return false // Carriers don't need to see carrier column
        }
        return true
    })

    if (isLoading) {
        return <LoadingSpinner size="lg" text="Loading shipment RFPs..." />
    }

    if (error) {
        return <ErrorMessage message="Failed to load shipment RFPs" />
    }

    const rfps = rfpsData?.data || []
    const stats = [
        {
            name: 'Total RFPs',
            value: rfpsData?.pagination.total || 0,
            icon: TruckIcon,
            color: 'text-blue-600',
        },
        {
            name: 'Draft',
            value: rfps.filter(r => r.status === 'DRAFT').length,
            icon: TruckIcon,
            color: 'text-gray-600',
        },
        {
            name: 'Assigned',
            value: rfps.filter(r => r.status === 'ASSIGNED').length,
            icon: TruckIcon,
            color: 'text-blue-600',
        },
        {
            name: 'Completed',
            value: rfps.filter(r => r.status === 'COMPLETED').length,
            icon: TruckIcon,
            color: 'text-green-600',
        },
    ]

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Shipment RFPs</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {isLogist
                            ? 'Manage shipment requests and track their progress'
                            : 'View and respond to shipment requests assigned to your organization'
                        }
                    </p>
                </div>

                {isLogist && (
                    <div className="flex space-x-3">
                        <Link to="/shipment-rfps/new" className="btn-primary">
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Create RFP
                        </Link>
                    </div>
                )}
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
                        onClick={() => handleStatusChange([])}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        Clear all
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <StatusFilter
                            selectedStatuses={selectedStatuses}
                            onStatusChange={handleStatusChange}
                        />
                    </div>
                </div>
            </div>

            {/* RFPs table */}
            <DataTable
                data={rfps}
                columns={filteredColumns}
                loading={isLoading}
                searchPlaceholder="Search RFPs by title, description, or route..."
                onRowClick={(rfp) => navigate(`/shipment-rfps/${rfp.id}`)}
            />

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
    )
}

export default ShipmentRfpsPage