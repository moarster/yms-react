import React, {useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {ArrowDownTrayIcon, ArrowUpTrayIcon, ChevronLeftIcon, PlusIcon, TrashIcon} from '@heroicons/react/24/outline'
import {catalogService} from '@/services/catalogService'
import {schemaService} from '@/services/schemaService'
import {CatalogItem, ListItem} from '@/types'
import AutoTable from '@/components/ui/AutoTable'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import Modal from '@/components/ui/Modal'
import {useUiStore} from '@/stores/uiStore'
import toast from 'react-hot-toast'
import {DataEntity} from '@/types'

const CatalogItemsPage: React.FC = () => {
    const { catalogKey } = useParams<{ catalogKey: string }>()
    const [selectedItems, setSelectedItems] = useState<any[]>([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingItem, setEditingItem] = useState<ListItem | CatalogItem | null>(null)
    const queryClient = useQueryClient()
    const { addNotification } = useUiStore()


    const { data: catalogInfo, isLoading: catalogLoading } = useQuery({
        queryKey: ['catalog-info', catalogKey],
        queryFn: async () => {
            return await catalogService.getCatalogInfo(catalogKey!)
        },
        enabled: !!catalogKey,
    })

    // Fetch JSON Schema
    const { data: schema, isLoading: schemaLoading } = useQuery({
        queryKey: ['catalog-schema', catalogKey, catalogInfo?.type],
        queryFn: async () => {
            if (!catalogKey || !catalogInfo) return null
            return await schemaService.getAnySchema(catalogKey)
        },
        enabled: !!catalogKey && !!catalogInfo,
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
                return await catalogService.getCatalogItems(catalogKey)
            }
        },
        enabled: !!catalogKey && !!catalogInfo,
    })

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (itemIds: string[]) => {
            if (!catalogKey || !catalogInfo) throw new Error('Missing catalog info')

            if (catalogInfo.type === 'LIST') {
                await Promise.all(itemIds.map(id => catalogService.deleteListItem(catalogKey, id)))
            } else {
                await Promise.all(itemIds.map(id => catalogService.deleteCatalogItem(catalogKey, id)))
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['catalog-items', catalogKey] })
            setSelectedItems([])
            toast.success(`Deleted ${selectedItems.length} item(s)`)
            addNotification({
                id: Date.now().toString(),
                type: 'success',
                title: 'Items deleted',
                message: `Successfully deleted ${selectedItems.length} item(s)`,
                timestamp: new Date().toISOString(),
                read: false,
            })
        },
        onError: (error) => {
            console.error('Error deleting items:', error)
            toast.error('Failed to delete items')
        },
    })

    // Export mutation
    const exportMutation = useMutation({
        mutationFn: async () => {
            if (!catalogKey || !catalogInfo) throw new Error('Missing catalog info')

            if (catalogInfo.type === 'LIST') {
                return await catalogService.exportListItems(catalogKey)
            } else {
                return await catalogService.exportCatalogItems(catalogKey)
            }
        },
        onSuccess: (blob) => {
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${catalogKey}-export.xlsx`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toast.success('Export completed')
        },
        onError: (error) => {
            console.error('Error exporting:', error)
            toast.error('Failed to export data')
        },
    })

    const handleDeleteSelected = () => {
        if (selectedItems.length === 0) return

        const itemIds = selectedItems.map(item => item.id)

        if (window.confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`)) {
            deleteMutation.mutate(itemIds)
        }
    }

    const handleRowClick = (item: any) => {
        setEditingItem(item)
        setShowEditModal(true)
    }

    const handleExport = () => {
        exportMutation.mutate()
    }

    const handleSelectionChange = (rows: any[]) => {
        setSelectedItems(rows)
    }

    const isLoading = catalogLoading || schemaLoading || itemsLoading
    const items = itemsData?.map(item => item.data) || []

    if (error) {
        return <ErrorMessage message="Failed to load catalog items" />
    }

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (!catalogInfo || !schema) {
        return <ErrorMessage message="Catalog information not available" />
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        to="/catalogs"
                        className="flex items-center text-gray-500 hover:text-gray-700"
                    >
                        <ChevronLeftIcon className="h-5 w-5 mr-1" />
                        Back to Catalogs
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{catalogInfo.title}</h1>
                        <p className="text-sm text-gray-500">
                            {catalogInfo.type} • {items.length} items
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {selectedItems.length > 0 && (
                        <button
                            onClick={handleDeleteSelected}
                            disabled={deleteMutation.isPending}
                            className="btn-danger"
                        >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Delete ({selectedItems.length})
                        </button>
                    )}

                    <button
                        onClick={handleExport}
                        disabled={exportMutation.isPending}
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

            {/* Auto-generated Table */}
            <div className="card p-0 overflow-hidden">
                <AutoTable
                    data={items}
                    schema={schema}
                    loading={isLoading}
                    onRowClick={handleRowClick}
                    onSelectionChange={handleSelectionChange}
                    enableBulkActions={true}
                    height="70vh"
                    config={{
                        pagination: true,
                        pageSize: 25,
                        enableSorting: true,
                        enableFiltering: true,
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

            {/* Create Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title={`Add New ${catalogInfo.type === 'LIST' ? 'List Item' : 'Catalog Item'}`}
            >
                <div className="p-6">
                    {/* Form would go here - could also be auto-generated from schema */}
                    <p className="text-gray-500">Create form component based on JSON Schema</p>
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
                    {/* Edit form would go here */}
                    <p className="text-gray-500">Edit form component based on JSON Schema</p>
                </div>
            </Modal>
        </div>
    )
}

export default CatalogItemsPage