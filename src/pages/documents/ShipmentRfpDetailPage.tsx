import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    UsersIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    DocumentIcon,
    MapPinIcon
} from '@heroicons/react/24/outline'
import { documentService } from '@/services/documentService'
import { schemaService } from '@/services/schemaService'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import CommonForm from '@/components/form/CommonForm'
import StatusBadge from '@/components/ui/StatusBadge'
import RouteSection from '@/components/form/RouteSection'
import toast from 'react-hot-toast'
import { CommonFormProps, SidebarSection, CustomSection } from '@/types/form'

const ShipmentRfpDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { user } = useAuthStore()
    const [formData, setFormData] = useState<any>({})
    const [isEditMode, setIsEditMode] = useState(false)
    const isCreating = id === 'new'

    // Fetch RFP data
    const { data: rfp, isLoading: rfpLoading } = useQuery({
        queryKey: ['rfp', id],
        queryFn: () => documentService.getShipmentRfp(id!),
        enabled: !isCreating,
    })

    // Fetch schema
    const { data: schema, isLoading: schemaLoading } = useQuery({
        queryKey: ['schema', 'shipment-rfp'],
        queryFn: () => schemaService.getAnySchema('shipment-rfp'),
    })

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (data: any) => documentService.updateShipmentRfp(id!, data),
        onSuccess: () => {
            toast.success('RFP updated successfully')
            setIsEditMode(false)
            queryClient.invalidateQueries({ queryKey: ['rfp', id] })
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update RFP')
        }
    })

    // Create mutation (for new RFPs)
    const createMutation = useMutation({
        mutationFn: (data: any) => documentService.createShipmentRfp(data),
        onSuccess: (newRfp) => {
            toast.success('RFP created successfully')
            navigate(`/shipment-rfps/${newRfp.id}`)
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create RFP')
        }
    })

    // Status update mutations
    const publishMutation = useMutation({
        mutationFn: () => documentService.executeAction(id!,'publish'),
        onSuccess: () => {
            toast.success('RFP published successfully')
            queryClient.invalidateQueries({ queryKey: ['rfp', id] })
        }
    })

    const cancelMutation = useMutation({
        mutationFn: () => documentService.executeAction(id!,'cancel'),
        onSuccess: () => {
            toast.success('RFP cancelled')
            queryClient.invalidateQueries({ queryKey: ['rfp', id] })
        }
    })

    // UI Schema configuration
    const uiSchema = useMemo(() => ({
        title: { 'ui:widget': 'text', 'ui:options': { className: 'text-xl font-semibold' } },
        description: { 'ui:widget': 'textarea', 'ui:options': { rows: 4 } },
        pickupLocation: { 'ui:title': 'Pickup Location', 'ui:layout': 'accordion' },
        deliveryLocation: { 'ui:title': 'Delivery Location', 'ui:layout': 'accordion' },
        cargoDetails: { 'ui:title': 'Cargo Details', 'ui:layout': 'accordion' },
        timeline: { 'ui:title': 'Timeline', 'ui:layout': 'accordion' },
        attachments: { 'ui:title': 'Attachments', 'ui:layout': 'section' }
    }), [schema])

    // Permission checks
    const canEdit = useMemo(() => {
        if (!rfp || !user) return isCreating
        if (authService.isDemoSuperuser(user)) return true

        switch (rfp.status) {
            case 'DRAFT':
                return rfp.createdBy === user.id
            case 'ASSIGNED':
                return authService.hasRole(user, 'LOGIST') ||
                    (authService.hasRole(user, 'CARRIER') && rfp?.data?._carrier?.id === user?.organization?.id)
            default:
                return false
        }
    }, [rfp, user, isCreating])

    const canPublish = useMemo(() => {
        return rfp?.status === 'DRAFT' && authService.hasRole(user, 'LOGIST')
    }, [rfp, user])

    const canCancel = useMemo(() => {
        return ['DRAFT', 'ASSIGNED'].includes(rfp?.status) && authService.hasRole(user, 'LOGIST')
    }, [rfp, user])

    // Form handlers
    const handleFormChange = (data: any) => {
        setFormData(data)
    }

    const handleFormSubmit = (data: any) => {
        if (isCreating) {
            createMutation.mutate(data.formData)
        } else {
            updateMutation.mutate(data.formData)
        }
    }

    const handleEditModeChange = (editMode: boolean) => {
        if (!canEdit && editMode) {
            toast.error('You do not have permission to edit this RFP')
            return
        }
        setIsEditMode(editMode)
    }

    // Sidebar sections
    const sidebarSections: SidebarSection[] = useMemo(() => {
        const sections: SidebarSection[] = []

        if (!isCreating && rfp) {
            // Status section
            sections.push({
                title: 'Status',
                icon: DocumentIcon,
                content: (
                    <div className="space-y-4">
                        <div>
                            <span className="text-sm font-medium text-gray-700">Current Status</span>
                            <div className="mt-1">
                                <StatusBadge status={rfp.status} />
                            </div>
                        </div>

                        {rfp.createdBy && (
                            <div>
                                <span className="text-sm font-medium text-gray-700">Created By</span>
                                <p className="text-sm text-gray-900 mt-1">{rfp.createdBy}</p>
                            </div>
                        )}

                        {rfp.urgency && (
                            <div>
                                <span className="text-sm font-medium text-gray-700">Urgency</span>
                                <div className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      rfp.urgency === 'HIGH' ? 'bg-red-100 text-red-800' :
                          rfp.urgency === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                  }`}>
                    {rfp.urgency}
                  </span>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })

            // Actions section
            if (canPublish || canCancel) {
                sections.push({
                    title: 'Actions',
                    content: (
                        <div className="space-y-3">
                            {canPublish && (
                                <button
                                    onClick={() => publishMutation.mutate()}
                                    disabled={publishMutation.isPending}
                                    className="w-full btn-primary"
                                >
                                    {publishMutation.isPending ? 'Publishing...' : 'Publish RFP'}
                                </button>
                            )}

                            {canCancel && (
                                <button
                                    onClick={() => cancelMutation.mutate()}
                                    disabled={cancelMutation.isPending}
                                    className="w-full btn-danger"
                                >
                                    {cancelMutation.isPending ? 'Cancelling...' : 'Cancel RFP'}
                                </button>
                            )}
                        </div>
                    )
                })
            }
        }

        return sections
    }, [rfp, isCreating, canPublish, canCancel, publishMutation, cancelMutation])

    // Custom sections
    const customSections: CustomSection[] = useMemo(() => {
        const sections: CustomSection[] = []

        // Route section - special handling for route points
        if (formData.route || (rfp?.data?.route && rfp.data.route.length > 0)) {
            sections.push({
                id: 'route-section',
                title: 'Route Points',
                icon: MapPinIcon,
                position: 'after-form',
                content: (
                    <RouteSection
                        routePoints={formData.route || rfp?.data?.route || []}
                        onChange={(points) => setFormData({ ...formData, route: points })}
                        disabled={!isEditMode}
                    />
                )
            })
        }

        // Proposals section (only for assigned RFPs)
        if (!isCreating && rfp?.status === 'ASSIGNED' && rfp.proposals) {
            sections.push({
                id: 'proposals-section',
                title: 'Carrier Proposals',
                icon: UsersIcon,
                position: 'after-form',
                content: (
                    <div className="space-y-4">
                        {rfp.proposals.map((proposal: any, index: number) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-900">{proposal.carrierName}</h4>
                                    <span className="text-lg font-semibold text-gray-900">
                    ${proposal.price?.toLocaleString()}
                  </span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>Submitted: {new Date(proposal.submittedAt).toLocaleDateString()}</span>
                                    <div className="flex items-center">
                                        {proposal.status === 'ACCEPTED' && (
                                            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                                        )}
                                        {proposal.status === 'REJECTED' && (
                                            <XCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                                        )}
                                        {proposal.status === 'PENDING' && (
                                            <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 mr-1" />
                                        )}
                                        <span className="capitalize">{proposal.status?.toLowerCase()}</span>
                                    </div>
                                </div>
                                {proposal.notes && (
                                    <p className="mt-2 text-sm text-gray-700">{proposal.notes}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )
            })
        }

        return sections
    }, [formData, rfp, isCreating, isEditMode])

    // Form configuration
    const formConfig = useMemo(() => ({
        schema: schema || {},
        uiSchema,
        formData: rfp?.data || formData,
        disabled: !isEditMode,
        showErrorList: false
    }), [schema, uiSchema, rfp, formData, isEditMode])

    // Form actions
    const actions = useMemo(() => ({
        primary: isEditMode ? {
            label: isCreating ? 'Create RFP' : 'Save Changes',
            onClick: () => {
                const form = document.getElementById('common-form') as HTMLFormElement
                form?.requestSubmit()
            },
            loading: createMutation.isPending || updateMutation.isPending
        } : undefined,
        secondary: isEditMode ? {
            label: 'Cancel',
            onClick: () => {
                setIsEditMode(false)
                setFormData(rfp?.data || {})
            }
        } : undefined
    }), [isEditMode, isCreating, createMutation.isPending, updateMutation.isPending, rfp])

    // Breadcrumbs
    const breadcrumbs = [
        { label: 'Shipment RFPs', href: '/shipment-rfps' },
        { label: isCreating ? 'Create New RFP' : rfp?.title || 'RFP Details' }
    ]

    const commonFormProps: CommonFormProps = {
        title: isCreating ? 'Create Shipment RFP' : rfp?.title || 'RFP Details',
        subtitle: isCreating ? 'Create a new shipment request for proposal' : undefined,
        breadcrumbs,
        formConfig,
        onFormChange: handleFormChange,
        onFormSubmit: handleFormSubmit,
        sidebarSections,
        customSections,
        actions,
        isLoading: rfpLoading || schemaLoading,
        isEditMode,
        onEditModeChange: canEdit ? handleEditModeChange : undefined,
        hideFormActions: true
    }

    return <CommonForm {...commonFormProps} />
}

export default ShipmentRfpDetailPage