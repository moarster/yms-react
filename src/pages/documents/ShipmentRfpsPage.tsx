import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
    PlusIcon,
    TruckIcon
} from '@heroicons/react/24/outline'
import { documentService } from '@/services/documentService'
import { schemaService } from '@/services/schemaService'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import { ShipmentRfp, DocumentStatus } from '@/types'
import AutoTable from '@/components/ui/AutoTable'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import clsx from 'clsx'

interface StatusFilterProps {
    selectedStatuses: DocumentStatus[]
    onStatusChange: (statuses: DocumentStatus[]) => void
}

const StatusFilter: React.FC<StatusFilterProps> = ({ selectedStatuses, onStatusChange }) => {
    const statuses: { value: DocumentStatus; label: string; color: string }[] = [
        { value: 'NEW', label: 'Draft', color: 'gray' },
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
    const [selectedRfps, setSelectedRfps] = useState<ShipmentRfp[]>([])

    // Fetch shipment RFP schema
    const { data: schema, isLoading: schemaLoading } = useQuery({
        queryKey: ['shipment-rfp-schema'],
        queryFn: async () => {
            return await schemaService.getAnySchema('shipment-rfp')
        },
    })

    // Fetch RFPs with filters
    const { data: rfpsData, isLoading: rfpsLoading, error } = useQuery({
        queryKey: ['shipment-rfps', selectedStatuses],
        queryFn: async () => {
            return await documentService.getShipmentRfps({
                page: 0,
                size: 50,
                status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
            })
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

    // Handle row selection
    const handleSelectionChange = (selectedRows: any[]) => {
        setSelectedRfps(selectedRows)
    }

    // Handle row click
    const handleRowClick = (rfp: ShipmentRfp) => {
        navigate(`/shipment-rfps/${rfp.id}`)
    }

    const isLoading = schemaLoading || rfpsLoading

    if (error) {
        return <ErrorMessage message="Failed to load shipment RFPs" />
    }

    if (isLoading) {
        return <LoadingSpinner size="lg" text="Loading shipment RFPs..." />
    }

    if (!schema) {
        return <ErrorMessage message="Schema not available" />
    }

    const rfps = rfpsData?.content?.map(item => ({
        ...(item.data || {}),
        id: item.id
    })) || []
    const stats = [
        {
            name: 'Total RFPs',
            value: rfpsData?.page.totalPages || 0,
            icon: TruckIcon,
            color: 'text-blue-600',
        },
        {
            name: 'Draft',
            value: rfpsData?.content.filter(r => r.status === 'NEW').length,
            icon: TruckIcon,
            color: 'text-gray-600',
        },
        {
            name: 'Assigned',
            value: rfpsData?.content.filter(r => r.status === 'ASSIGNED').length,
            icon: TruckIcon,
            color: 'text-blue-600',
        },
        {
            name: 'Completed',
            value: rfpsData?.content.filter(r => r.status === 'CLOSED').length,
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

            {/* RFPs Auto-generated Table */}
            <div className="card p-0 overflow-hidden">
                <AutoTable
                    data={rfps}
                    schema={schema}
                    loading={rfpsLoading}
                    onRowClick={handleRowClick}
                    onSelectionChange={handleSelectionChange}
                    enableBulkActions={isLogist}
                    height="70vh"
                    config={{
                        pagination: true,
                        pageSize: 25,
                        enableSorting: true,
                        enableFiltering: true,
                        enableSelection: isLogist
                    }}
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
    )
}

export default ShipmentRfpsPage