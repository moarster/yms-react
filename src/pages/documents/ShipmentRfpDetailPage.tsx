// src/pages/documents/ShipmentRfpDetailPage.tsx
import React, { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Form from '@rjsf/mui'
import validator from '@rjsf/validator-ajv8'
import { RJSFSchema, UiSchema } from '@rjsf/utils'
import {
    ChevronLeftIcon,
    PencilIcon,
    EyeIcon,
    ClockIcon,
    MapPinIcon,
    ScaleIcon,
    DocumentIcon,
    PaperClipIcon,
    UsersIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { documentService } from '@/services/documentService'
import { schemaService } from '@/services/schemaService'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { authService } from '@/services/authService'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import StatusBadge from '@/components/ui/StatusBadge'
import toast from 'react-hot-toast'

const CustomFieldTemplate = (props: any) => {
    const { id, label, help, required, description, errors, children, schema } = props

    // Check if this field should be in sidebar
    const isSidebarField = schema['x-layout'] === 'sidebar'

    if (isSidebarField) {
        return (
            <div className="mb-4">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}{required && ' *'}
                </label>
                {children}
                {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
                {errors && <div className="text-red-600 text-sm mt-1">{errors}</div>}
            </div>
        )
    }

    return (
        <div className="mb-6">
            <label htmlFor={id} className="block text-sm font-medium text-gray-900 mb-2">
                {label}{required && ' *'}
            </label>
            {children}
            {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
            {help && <p className="text-xs text-gray-500 mt-1">{help}</p>}
            {errors && <div className="text-red-600 text-sm mt-1">{errors}</div>}
        </div>
    )
}

const CustomObjectFieldTemplate = (props: any) => {
    const { title, description, properties, schema } = props

    // Check if this is an accordion section
    const isAccordion = schema['x-layout'] === 'accordion'
    const [isExpanded, setIsExpanded] = useState(true)

    if (isAccordion) {
        return (
            <div className="card mb-6">
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full px-6 py-4 border-b border-gray-200 flex items-center justify-between text-left"
                >
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    <ChevronLeftIcon className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>
                {isExpanded && (
                    <div className="p-6">
                        {description && <p className="text-gray-600 mb-4">{description}</p>}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {properties.map((element: any) => element.content)}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="card mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                {description && <p className="text-gray-600">{description}</p>}
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {properties.map((element: any) => element.content)}
                </div>
            </div>
        </div>
    )
}

interface DocumentSectionProps {
    title: string
    children: React.ReactNode
    actions?: React.ReactNode
    icon?: React.ComponentType<{ className?: string }>
}

const DocumentSection: React.FC<DocumentSectionProps> = ({ title, children, actions, icon: Icon }) => (
    <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {Icon && <Icon className="h-5 w-5 text-gray-400" />}
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                </div>
                {actions && <div className="flex space-x-2">{actions}</div>}
            </div>
        </div>
        <div className="p-6">{children}</div>
    </div>
)

const ShipmentRfpDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { addNotification } = useUiStore()
    const queryClient = useQueryClient()
    const [isEditMode, setIsEditMode] = useState(false)
    const [formData, setFormData] = useState<any>({})

    const isLogist = authService.isLogist(user)
    const isCarrier = authService.isCarrier(user)

    // Fetch RFP details
    const { data: rfp, isLoading, error } = useQuery({
        queryKey: ['shipment-rfp', id],
        queryFn: async () => {
            return await documentService.getShipmentRfp(id!)
        },
        enabled: !!id,
    })

    // Fetch RFP schema
    const { data: schema } = useQuery({
        queryKey: ['shipment-rfp-schema'],
        queryFn: () => schemaService.getAnySchema('shipment-rfp'),
    })

    // Fetch available actions
    const { data: actions } = useQuery({
        queryKey: ['shipment-rfp-actions', id],
        queryFn: async () => {
            return await documentService.getAvailableActions(id!)
        },
        enabled: !!id && !isLoading && rfp?.status !== 'CLOSED'
    })

    // Update RFP mutation
    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            await documentService.updateShipmentRfp(id!, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shipment-rfp', id] })
            setIsEditMode(false)
            toast.success('RFP updated successfully')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update RFP')
        },
    })

    // Execute action mutation
    const actionMutation = useMutation({
        mutationFn: async (actionName: string) => {
            await documentService.executeAction('shipment-rfp', id!, actionName)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shipment-rfp', id] })
            queryClient.invalidateQueries({ queryKey: ['shipment-rfp-actions', id] })
            toast.success('Action executed successfully')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to execute action')
        },
    })

    // Create UI Schema for layout control
    const uiSchema: UiSchema = useMemo(() => {
        if (!schema) return {}

        return {
            'ui:layout': 'grid',
            'ui:options': {
                sidebar: {
                    width: '300px',
                    fields: ['status', 'createdAt', 'createdBy', 'assignedTo', 'urgency']
                }
            },
            title: {
                'ui:widget': 'text',
                'ui:options': {
                    className: 'text-xl font-semibold'
                }
            },
            description: {
                'ui:widget': 'textarea',
                'ui:options': {
                    rows: 4
                }
            },
            pickupLocation: {
                'ui:title': 'Pickup Location',
                'ui:layout': 'accordion',
                'ui:options': {
                    icon: 'MapPin'
                }
            },
            deliveryLocation: {
                'ui:title': 'Delivery Location',
                'ui:layout': 'accordion',
                'ui:options': {
                    icon: 'MapPin'
                }
            },
            cargoDetails: {
                'ui:title': 'Cargo Details',
                'ui:layout': 'accordion',
                'ui:options': {
                    icon: 'Scale'
                }
            },
            timeline: {
                'ui:title': 'Timeline',
                'ui:layout': 'accordion',
                'ui:options': {
                    icon: 'Clock'
                }
            },
            attachments: {
                'ui:title': 'Attachments',
                'ui:layout': 'section',
                'ui:options': {
                    icon: 'PaperClip'
                }
            }
        }
    }, [schema])

    // Handle form submission
    const handleSubmit = (data: any) => {
        setFormData(data.formData)
        updateMutation.mutate(data.formData)
    }

    // Handle action execution
    const handleActionClick = (actionName: string) => {
        actionMutation.mutate(actionName)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (error || !rfp) {
        return (
            <div className="text-center py-12">
                <XCircleIcon className="mx-auto h-12 w-12 text-red-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">RFP not found</h3>
                <p className="mt-1 text-sm text-gray-500">The requested RFP could not be loaded.</p>
                <Link to="/shipment-rfps" className="btn-primary mt-4 inline-flex">
                    Back to RFPs
                </Link>
            </div>
        )
    }

    const canEdit = isLogist && ['NEW', 'ASSIGNED'].includes(rfp.status)
    const canCarrierEdit = isCarrier && rfp.status === 'ASSIGNED'
        //&& rfp.assignedTo === user?.organizationId

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                    <Link
                        to="/shipment-rfps"
                        className="inline-flex items-center text-gray-500 hover:text-gray-700"
                    >
                        <ChevronLeftIcon className="h-5 w-5 mr-1" />
                        Back to RFPs
                    </Link>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-semibold text-gray-900">{rfp.title}</h1>
                        <StatusBadge status={rfp.status?rfp.status:"NEW"} />
                    </div>

                    <div className="flex items-center space-x-3">
                        {!isEditMode && (canEdit || canCarrierEdit) && (
                            <button
                                onClick={() => setIsEditMode(true)}
                                className="btn-secondary inline-flex items-center"
                            >
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Edit
                            </button>
                        )}

                        {isEditMode && (
                            <>
                                <button
                                    onClick={() => setIsEditMode(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="rfp-form"
                                    disabled={updateMutation.isPending}
                                    className="btn-primary"
                                >
                                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </button>
                            </>
                        )}

                        {/* Action buttons */}
                        {actions?.map((action: any) => (
                            <button
                                key={action.name}
                                onClick={() => handleActionClick(action.name)}
                                disabled={actionMutation.isPending}
                                className={`btn-${action.variant || 'secondary'}`}
                            >
                                {actionMutation.isPending ? 'Processing...' : action.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar - Key Info */}
                <div className="lg:col-span-1">
                    <div className="card p-6 space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Info</h3>

                            <div className="space-y-4">
                                <div>
                                    <span className="text-sm text-gray-500">Status</span>
                                    <div className="mt-1">
                                        <StatusBadge status={rfp?.status} />
                                    </div>
                                </div>

                                <div>
                                    <span className="text-sm text-gray-500">Created</span>
                                    <div className="mt-1 text-sm text-gray-900">
                                        {new Date(rfp?.createdDate).toLocaleDateString()}
                                    </div>
                                </div>

                                <div>
                                    <span className="text-sm text-gray-500">Created By</span>
                                    <div className="mt-1 text-sm text-gray-900">{rfp.createdBy}</div>
                                </div>

                                {rfp.assignedTo && (
                                    <div>
                                        <span className="text-sm text-gray-500">Assigned To</span>
                                        <div className="mt-1 text-sm text-gray-900">{rfp.assignedTo}</div>
                                    </div>
                                )}

                                {rfp.urgency && (
                                    <div>
                                        <span className="text-sm text-gray-500">Urgency</span>
                                        <div className="mt-1">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {schema && (
                        <Form
                            id="rfp-form"
                            schema={schema as RJSFSchema}
                            uiSchema={uiSchema}
                            formData={formData || rfp}
                            onChange={(e) => setFormData(e.formData)}
                            onSubmit={handleSubmit}
                            validator={validator}
                            disabled={!isEditMode}
                            templates={{
                                FieldTemplate: CustomFieldTemplate,
                                ObjectFieldTemplate: CustomObjectFieldTemplate,
                            }}
                            showErrorList={false}
                        >
                            {/* Hide submit button - we have custom ones in header */}
                            <div style={{ display: 'none' }}>
                                <button type="submit" />
                            </div>
                        </Form>
                    )}

                    {/* Proposals Section */}
                    {rfp.status === 'ASSIGNED' && (
                        <DocumentSection title="Carrier Proposals" icon={UsersIcon}>
                            <div className="space-y-4">
                                {rfp.proposals?.map((proposal: any, index: number) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium text-gray-900">{proposal.carrierName}</h4>
                                            <span className="text-lg font-semibold text-green-600">
                                                €{proposal.rate?.toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{proposal.notes}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>Submitted: {new Date(proposal.submittedAt).toLocaleDateString()}</span>
                                            <span>ETA: {proposal.estimatedDelivery}</span>
                                        </div>
                                    </div>
                                ))}

                                {(!rfp.proposals || rfp.proposals.length === 0) && (
                                    <p className="text-gray-500 text-center py-8">No proposals submitted yet</p>
                                )}
                            </div>
                        </DocumentSection>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ShipmentRfpDetailPage