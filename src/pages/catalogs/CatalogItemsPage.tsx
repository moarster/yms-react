import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    ChevronLeftIcon
} from '@heroicons/react/24/outline'
import { catalogService } from '@/services/catalogService'
import {  ListItem, CatalogItem } from '@/types'
import DataTable from '@/components/ui/DataTable'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import Modal from '@/components/ui/Modal'
import { useUiStore } from '@/stores/uiStore'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const CatalogItemsPage: React.FC = () => {
    const { catalogKey } = useParams<{ catalogKey: string }>()
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingItem, setEditingItem] = useState<ListItem | CatalogItem | null>(null)
    const queryClient = useQueryClient()
    const { addNotification } = useUiStore()

    // Fetch catalog info
    const { data: catalogInfo, isLoading: catalogLoading } = useQuery({
        queryKey: ['catalog-info', catalogKey],
        queryFn: async () => {
            const response = await catalogService.getCatalogInfo(catalogKey!)
            return response.data
        },
        enabled: !!catalogKey,
    })

    // Fetch catalog items
    const { data: itemsData, isLoading: itemsLoading, error } = useQuery({
        queryKey: ['catalog-items', catalogKey, catalogInfo?.type],
        queryFn: async () => {
            if (!catalogKey || !catalogInfo) return null

            if (catalogInfo.type === 'LIST') {
                const response = await catalogService.getListItems(catalogKey)
                return response.data
            } else {
                const response = await catalogService.getCatalogItems(catalogKey)
                return response.data
            }
        },
        enabled: !!catalogKey && !!catalogInfo,
    })

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (ids: string[]) => {
            if (!catalogKey || !catalogInfo) throw new Error('Missing catalog info')

            if (catalogInfo.type === 'LIST') {
                await catalogService.bulkDeleteListItems(catalogKey, ids)
            } else {
                await catalogService.bulkDeleteCatalogItems(catalogKey, ids)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['catalog-items', catalogKey] })
            setSelectedItems([])
            toast.success('Items deleted successfully')
            addNotification({
                type: 'success',
                title: 'Items Deleted',
                message: `${selectedItems.length} item(s) deleted successfully`,
            })
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete items')
        },
    })

    // Column definitions for lists
    const listColumns: ColumnDef<ListItem>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <input
                    type="checkbox"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={(e) => {
                        table.toggleAllPageRowsSelected()
                        if (e.target.checked) {
                            setSelectedItems(itemsData?.data.map(item => item.id) || [])
                        } else {
                            setSelectedItems([])
                        }
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={selectedItems.includes(row.original.id)}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedItems([...selectedItems, row.original.id])
                        } else {
                            setSelectedItems(selectedItems.filter(id => id !== row.original.id))
                        }
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
            ),
            enableSorting: false,
        },
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => (
                <div className="font-medium text-gray-900">{row.original.title}</div>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Created',
            cell: ({ row }) => (
                <div className="text-sm text-gray-500">
                    {format(new Date(row.original.createdAt), 'MMM dd, yyyy')}
                </div>
            ),
        },
        {
            accessorKey: 'updatedAt',
            header: 'Updated',
            cell: ({ row }) => (
                <div className="text-sm text-gray-500">
                    {format(new Date(row.original.updatedAt), 'MMM dd, yyyy')}
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
                            setEditingItem(row.original)
                            setShowEditModal(true)
                        }}
                        className="text-primary-600 hover:text-primary-900"
                    >
                        <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setSelectedItems([row.original.id])
                            deleteMutation.mutate([row.original.id])
                        }}
                        className="text-red-600 hover:text-red-900"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            ),
            enableSorting: false,
        },
    ]

    // Column definitions for catalogs (will be dynamic based on schema)
    const catalogColumns: ColumnDef<CatalogItem>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <input
                    type="checkbox"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={(e) => {
                        table.toggleAllPageRowsSelected()
                        if (e.target.checked) {
                            setSelectedItems(itemsData?.data.map(item => item.id) || [])
                        } else {
                            setSelectedItems([])
                        }
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={selectedItems.includes(row.original.id)}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedItems([...selectedItems, row.original.id])
                        } else {
                            setSelectedItems(selectedItems.filter(id => id !== row.original.id))
                        }
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
            ),
            enableSorting: false,
        },
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => (
                <div className="font-medium text-gray-900">{row.original.title}</div>
            ),
        },
        // Dynamic columns based on schema would go here
        {
            accessorKey: 'data',
            header: 'Data',
            cell: ({ row }) => (
                <div className="text-sm text-gray-500 max-w-xs truncate">
                    {JSON.stringify(row.original.data)}
                </div>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Created',
            cell: ({ row }) => (
                <div className="text-sm text-gray-500">
                    {format(new Date(row.original.createdAt), 'MMM dd, yyyy')}
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
                            setEditingItem(row.original)
                            setShowEditModal(true)
                        }}
                        className="text-primary-600 hover:text-primary-900"
                    >
                        <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setSelectedItems([row.original.id])
                            deleteMutation.mutate([row.original.id])
                        }}
                        className="text-red-600 hover:text-red-900"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            ),
            enableSorting: false,
        },
    ]

    const handleExport = async () => {
        if (!catalogKey) return
        try {
            await catalogService.exportCatalog(catalogKey, 'xlsx')
            toast.success('Export started')
        } catch (error) {
            toast.error('Failed to export catalog')
        }
    }

    const handleBulkDelete = () => {
        if (selectedItems.length === 0) return

        if (confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`)) {
            deleteMutation.mutate(selectedItems)
        }
    }

    if (catalogLoading) {
        return <LoadingSpinner size="lg" text="Loading catalog..." />
    }

    if (!catalogInfo) {
        return <ErrorMessage message="Catalog not found" />
    }

    if (error) {
        return <ErrorMessage message="Failed to load catalog items" />
    }

    const columns = catalogInfo.type === 'LIST' ? listColumns : catalogColumns
    const items = itemsData?.data || []

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                    <li>
                        <Link to="/catalogs" className="text-gray-400 hover:text-gray-500">
                            <ChevronLeftIcon className="h-5 w-5 inline mr-1" />
                            Catalogs
                        </Link>
                    </li>
                    <li>
                        <span className="text-gray-500">/</span>
                    </li>
                    <li>
                        <span className="text-gray-900 font-medium">{catalogInfo.title}</span>
                    </li>
                </ol>
            </nav>

            {/* Page header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{catalogInfo.title}</h1>
                    <p className="mt-1 text-sm text-gray-500">{catalogInfo.description}</p>
                    <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                catalogInfo.type === 'LIST'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
            }`}>
              {catalogInfo.type === 'LIST' ? 'Simple List' : 'Structured Catalog'}
            </span>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={handleExport}
                        className="btn-outline"
                    >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        Export
                    </button>
                    <button className="btn-outline">
                        <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                        Import
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Item
                    </button>
                </div>
            </div>

            {/* Bulk actions */}
            {selectedItems.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
              <span className="text-sm font-medium text-blue-900">
                {selectedItems.length} item(s) selected
              </span>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleBulkDelete}
                                disabled={deleteMutation.isPending}
                                className="btn bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500"
                            >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete Selected
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Items table */}
            <DataTable
                data={items}
                columns={columns}
                loading={itemsLoading}
                searchPlaceholder={`Search ${catalogInfo.type === 'LIST' ? 'list items' : 'catalog items'}...`}
                onRowClick={(item) => {
                    setEditingItem(item)
                    setShowEditModal(true)
                }}
            />

            {/* Modals would go here - simplified for this example */}
            {showCreateModal && (
                <Modal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    title={`Add ${catalogInfo.type === 'LIST' ? 'List Item' : 'Catalog Item'}`}
                >
                    <div className="p-6">
                        <p>Create form would go here...</p>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="btn-outline"
                            >
                                Cancel
                            </button>
                            <button className="btn-primary">Create</button>
                        </div>
                    </div>
                </Modal>
            )}

            {showEditModal && editingItem && (
                <Modal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false)
                        setEditingItem(null)
                    }}
                    title={`Edit ${catalogInfo.type === 'LIST' ? 'List Item' : 'Catalog Item'}`}
                >
                    <div className="p-6">
                        <p>Edit form would go here for: {editingItem.title}</p>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowEditModal(false)
                                    setEditingItem(null)
                                }}
                                className="btn-outline"
                            >
                                Cancel
                            </button>
                            <button className="btn-primary">Save</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default CatalogItemsPage