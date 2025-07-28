// noinspection t

import React, { useState } from 'react'
import { useParams, Link, useNavigate,useLocation } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    ChevronLeftIcon,
    PlusIcon,
    TrashIcon,
    ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'
import { catalogService } from '@/services/catalogService'
import { schemaService } from '@/services/schemaService'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import AutoTable from '@/components/ui/AutoTable'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Modal from '@/components/ui/Modal'
import toast from 'react-hot-toast'
import {CatalogItem} from "@/types";

const CatalogItemsPage: React.FC = () => {
    const { catalogKey } = useParams<{ catalogKey: string }>()
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { addNotification } = useUiStore()
    const queryClient = useQueryClient()

    const [selectedItems, setSelectedItems] = useState<any[]>([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const location = useLocation()
    const isListType = location.pathname.startsWith('/list/')
    const type = isListType ? 'list' : 'catalog'

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


    const { data: pagedItems, isLoading, error } = useQuery({
        queryKey: [isListType ? 'list-items' : 'catalog-items', catalogKey],
        queryFn: async () => {
            const result = await catalogService.getListItems(catalogKey!, type)
            return result
        },
        enabled: !!catalogKey,
    })

    const items = pagedItems?.content?.map(item => {
        if (isListType) {
            return { title: item.title }
        } else {
            return (item as CatalogItem)?.data
        }
    }) || []
    const { data: schema } = useQuery({
        queryKey: ['catalog-schema', catalogKey],
        queryFn: () => schemaService.getAnySchema(catalogKey!),
        enabled: !!catalogKey && !isListType,
    })

    // Delete items mutation
    const deleteMutation = useMutation({
        mutationFn: async (itemIds: string[]) => {
            await Promise.all(
                itemIds.map(id => catalogService.deleteCatalogItem(catalogKey!, id))
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['catalog-items', catalogKey] })
            setSelectedItems([])
            toast.success('Items deleted successfully')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete items')
        },
    })

    // Handle row selection
    const handleSelectionChange = (selected: any[]) => {
        setSelectedItems(selected)
    }

    // Handle row click (view/edit)
    const handleRowClick = (row: any) => {
        if (isListType) {
            return; // Lists don't have detailed views
        }
        navigate(`/${type}/${catalogKey}/items/${row.id}`)
    }

    // Handle edit action
    const handleEdit = (row: any) => {
        setEditingItem(row)
        setShowEditModal(true)
    }

    // Handle delete action
    const handleDelete = (row: any) => {
        if (confirm('Are you sure you want to delete this item?')) {
            deleteMutation.mutate([row.id])
        }
    }

    // Handle view action
    const handleView = (row: any) => {
        navigate(`/${type}/${catalogKey}/items/${row.id}`) // /catalogs or /lists
    }

    // Handle bulk delete
    const handleBulkDelete = () => {
        if (selectedItems.length === 0) return

        if (confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
            deleteMutation.mutate(selectedItems.map(item => item.id))
        }
    }

    // Handle export
    const handleExport = () => {
        // Implementation for export functionality
        toast.custom('Export functionality coming soon')
    }

    if (catalogLoading || isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (error || !catalogInfo || (!schema && type !== 'list')) {
        return (
            <div className="text-center py-12">
                <h3 className="mt-2 text-sm font-medium text-gray-900">Catalog not found</h3>
                <p className="mt-1 text-sm text-gray-500">The requested catalog could not be loaded.</p>
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
                        <h1 className="text-2xl font-semibold text-gray-900">{catalogInfo.title}</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage {catalogInfo?.type === 'LIST' ? 'list items' : 'catalog entries'}
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Bulk actions */}
                        {selectedItems.length > 0 && (
                            <>
                                <span className="text-sm text-gray-500">
                                    {selectedItems.length} selected
                                </span>
                                <button
                                    onClick={handleBulkDelete}
                                    disabled={deleteMutation.isPending}
                                    className="btn-danger"
                                >
                                    <TrashIcon className="h-4 w-4 mr-2" />
                                    Delete Selected
                                </button>
                            </>
                        )}

                        {/* Action buttons */}
                        <button
                            onClick={handleExport}
                            className="btn-secondary"
                        >
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

            {/* Main Content */}
            <div className="space-y-6">
                {/* Data Table */}
                <div className="card">
                    <AutoTable
                        data={items}
                        schema={catalogInfo?.type === 'LIST' ? undefined : schema}
                        loading={isLoading}
                        onRowClick={handleRowClick}
                        onSelectionChange={handleSelectionChange}
                        onEdit={catalogInfo?.type === 'LIST' ? undefined : handleEdit}
                        onDelete={handleDelete}
                        onView={catalogInfo?.type === 'LIST' ? undefined : handleView}
                        enableBulkActions={true}
                        enableActions={true}
                        showToolbar={true}
                        height="70vh"
                        density="standard"
                        config={{
                            pagination: true,
                            pageSize: 25,
                            enableSorting: true,
                            enableFiltering: catalogInfo?.type !== 'LIST',
                            enableSelection: true
                        }}
                    />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="card p-4">
                        <div className="text-sm font-medium text-gray-500">Total Items</div>
                        <div className="text-2xl font-semibold text-gray-900">{items.length}</div>
                    </div>
                    <div className="card p-4">
                        <div className="text-sm font-medium text-gray-500">Selected</div>
                        <div className="text-2xl font-semibold text-gray-900">{selectedItems.length}</div>
                    </div>
                    <div className="card p-4">
                        <div className="text-sm font-medium text-gray-500">Type</div>
                        <div className="text-lg font-medium text-gray-900">{catalogInfo.type}</div>
                    </div>
                    <div className="card p-4">
                        <div className="text-sm font-medium text-gray-500">Last Updated</div>
                        <div className="text-sm text-gray-900">Just now</div>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title={`Add New ${catalogInfo.type === 'LIST' ? 'List Item' : 'Catalog Item'}`}
            >
                <div className="p-6">
                    {/* This would use RJSF form based on schema */}
                    <p className="text-gray-500">RJSF form component will be generated from schema here</p>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button className="btn-primary">
                            Create Item
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false)
                    setEditingItem(null)
                }}
                title="Edit Item"
            >
                <div className="p-6">
                    {/* This would use RJSF form based on schema with editingItem data */}
                    <p className="text-gray-500">RJSF edit form component will be generated from schema here</p>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={() => {
                                setShowEditModal(false)
                                setEditingItem(null)
                            }}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button className="btn-primary">
                            Save Changes
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default CatalogItemsPage