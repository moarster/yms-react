// noinspection D

import {
    ArrowDownTrayIcon,
    ChevronLeftIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import toast from 'react-hot-toast'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { catalogService } from '@/features/catalogs/catalogService'
import {schemaService, TableConfig} from '@/services/schemaService'
import LoadingSpinner from '@/shared/ui/LoadingSpinner'
import {BaseTableRow} from "@/shared/ui/TabulatorTable/table.types.ts";
import TabulatorTable from '@/shared/ui/TabulatorTable/TabulatorTable'
import {useTableData} from "@/shared/ui/TabulatorTable/useTableData.ts";

import { CatalogItem } from './catalog.types.ts'

interface CatalogItemRow extends BaseTableRow, CatalogItem {}

const CatalogItemsPage: React.FC = () => {
    const { catalogKey } = useParams<{ catalogKey: string }>()
    const navigate = useNavigate()
    const location = useLocation()
    const isListType = location.pathname.startsWith('/list/')
    const type = isListType ? 'LIST' : 'CATALOG'


    // Fetch catalog info
    const { data: catalogInfo, isLoading: catalogLoading } = useQuery({
        queryKey: [isListType ? 'list-info' : 'catalog-info', catalogKey],
        queryFn: async () => {
            return isListType
                ? await catalogService.getListInfo(catalogKey!)
                : await catalogService.getCatalogInfo(catalogKey!)
        },
        enabled: !!catalogKey,
    })

    // Fetch schema
    const { data: schema } = useQuery({
        queryKey: ['catalog-schema', catalogKey],
        queryFn: () => schemaService.getAnySchema(catalogKey!),
        enabled: !!catalogKey && !isListType,
    })

    // Use common table data hook
    const {
        data: items,
        isLoading,
        error,
        selectedRows,
        handleSelectionChange,
        handleDelete,
        handleBulkDelete,
    } = useTableData<CatalogItemRow>({
        queryKey: [isListType ? 'list-items' : 'catalog-items', catalogKey],
        fetchFn: () => catalogService.getListItems(catalogKey!, type),
        deleteFn: async (ids) => {
            await Promise.all(
                ids.map(id => catalogService.deleteCatalogItem(catalogKey!, id.toString()))
            )
        },
        transformData: (result) => {
            const items = result?.content || []
            return items.map((item: any) => {
                if (isListType) {
                    return {
                        id: item.id,
                        title: item.title
                    }
                } else {
                    return {
                        ...item.data,
                        id: item.id,
                        status: item.status,
                    }
                }
            })
        },
        onRowClick: (row) => navigate(`/${type}/${catalogKey}/items/${row.id}`),

    })

    // Table configuration
    const tableConfig: TableConfig = useMemo(() => ({
        editable: !isListType, // Enable inline editing for catalogs
        selectable: true,
        pagination: true,
        pageSize: 20,
        sortable: true,
        filterable: true,
        height: '70vh',
        density: 'standard',
    }), [isListType])

    // Handle export
    const handleExport = () => {
        toast.custom('Export functionality coming soon')
    }

    // Handle data changes (for inline editing)
    const handleDataChange = (updatedData: CatalogItemRow[]) => {
        // Here you would typically save the changes to the backend
        console.log('Data changed:', updatedData)
        toast.success('Changes saved')
    }

    if (catalogLoading || isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (error || !catalogInfo || (!schema && !isListType)) {
        return (
            <div className="text-center py-12">
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Catalog not found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    The requested catalog could not be loaded.
                </p>
                <Link to="/catalogs" className="btn-primary mt-4 inline-flex">
                    Back to Catalogs
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                    <Link
                        to="/catalogs"
                        className="inline-flex items-center text-gray-500 hover:text-gray-700"
                    >
                        <ChevronLeftIcon className="h-5 w-5 mr-1" />
                        Back to Catalogs
                    </Link>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {catalogInfo.title}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage {catalogInfo?.type === 'LIST' ? 'list items' : 'catalog entries'}
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Bulk actions */}
                        {selectedRows.length > 0 && (
                            <>
                <span className="text-sm text-gray-500">
                  {selectedRows.length} selected
                </span>
                                <button
                                    onClick={handleBulkDelete}
                                    className="btn-danger"
                                >
                                    <TrashIcon className="h-4 w-4 mr-2" />
                                    Delete Selected
                                </button>
                            </>
                        )}

                        {/* Action buttons */}
                        <button onClick={handleExport} className="btn-secondary">
                            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                            Export
                        </button>

                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-primary"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add {catalogInfo.type === 'LIST' ? 'Item' : 'Entry'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content - Table */}
            <div className="card p-0 overflow-hidden">
                <TabulatorTable<CatalogItemRow>
                    data={items}
                    schema={!isListType ? schema : undefined}
                    config={tableConfig}
                    loading={isLoading}
                    enableInlineEdit={true}
                    onDelete={handleDelete}
                    onSelectionChange={handleSelectionChange}
                    onDataChange={handleDataChange}
                />
            </div>

        </div>
    )
}

export default CatalogItemsPage