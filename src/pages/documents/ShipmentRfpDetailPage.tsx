import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    ChevronLeftIcon,
    MapPinIcon,
    CalendarIcon,
    ScaleIcon,
    DocumentIcon,
    PaperClipIcon,
    CheckCircleIcon,
    XCircleIcon,
    PencilIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import { documentService } from '@/services/documentService'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import {  DocumentAction } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import StatusBadge from '@/components/ui/StatusBadge'
import Modal from '@/components/ui/Modal'
import { useUiStore } from '@/stores/uiStore'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface ActionButtonProps {
    action: DocumentAction
    onExecute: (action: string) => void
    loading?: boolean
}

const ActionButton: React.FC<ActionButtonProps> = ({ action, onExecute, loading }) => {
    const getButtonStyle = (actionKey: string) => {
        switch (actionKey) {
            case 'publish':
                return 'btn-primary'
            case 'confirm':
                return 'btn bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
            case 'cancel':
                return 'btn-danger'
            case 'complete':
                return 'btn bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500'
            default:
                return 'btn-outline'
        }
    }

    const getIcon = (actionKey: string) => {
        switch (actionKey) {
            case 'publish':
                return <DocumentIcon className="h-4 w-4 mr-2" />
            case 'confirm':
                return <CheckCircleIcon className="h-4 w-4 mr-2" />
            case 'cancel':
                return <XCircleIcon className="h-4 w-4 mr-2" />
            case 'complete':
                return <CheckCircleIcon className="h-4 w-4 mr-2" />
            default:
                return null
        }
    }

    const handleClick = () => {
        if (action.confirmationRequired) {
            if (confirm(`Are you sure you want to ${action.label.toLowerCase()}?`)) {
                onExecute(action.key)
            }
        } else {
            onExecute(action.key)
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={getButtonStyle(action.key)}
            title={action.description}
        >
            {getIcon(action.key)}
            {loading ? 'Processing...' : action.label}
        </button>
    )
}

interface DocumentSectionProps {
    title: string
    children: React.ReactNode
    actions?: React.ReactNode
}

const DocumentSection: React.FC<DocumentSectionProps> = ({ title, children, actions }) => (
    <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
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
    const [showRateModal, setShowRateModal] = useState(false)

    const isLogist = authService.isLogist(user)
    const isCarrier = authService.isCarrier(user)

    // Fetch RFP details
    const { data: rfp, isLoading, error } = useQuery({
        queryKey: ['shipment-rfp', id],
        queryFn: async () => {
            const response = await documentService.getShipmentRfp(id!)
            return response.data
        },
        enabled: !!id,
    })

    // Fetch available actions
    const { data: actions } = useQuery({
        queryKey: ['shipment-rfp-actions', id],
        queryFn: async () => {
            const response = await documentService.getAvailableActions('shipment-rfp', 'shipment-rfp', id!)
            return response.data
        },
        enabled: !!id && !!rfp,
    })

    // Action execution mutation
    const actionMutation = useMutation({
        mutationFn: async (actionKey: string) => {
            const response = await documentService.executeAction('shipment-rfp', 'shipment-rfp', id!, actionKey)
            return response.data
        },
        onSuccess: (data, actionKey) => {
            queryClient.invalidateQueries({ queryKey: ['shipment-rfp', id] })
            queryClient.invalidateQueries({ queryKey: ['shipment-rfp-actions', id] })
            queryClient.invalidateQueries({ queryKey: ['shipment-rfps'] })

            toast.success(`Action "${actionKey}" executed successfully`)
            addNotification({
                type: 'success',
                title: 'Action Completed',
                message: `Successfully executed action: ${actionKey}`,
            })
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to execute action')
        },
    })

    if (isLoading) {
        return <LoadingSpinner size="lg" text="Loading RFP details..." />
    }

    if (error || !rfp) {
        return <ErrorMessage message="Failed to load RFP details" />
    }

    // Filter actions based on user role
    const filteredActions = actions?.filter(action =>
        action.roles.includes(isLogist ? 'LOGIST' : 'CARRIER')
    ) || []

    // Check access rules for carrier
    const canCarrierEdit = isCarrier &&
        rfp.status === 'ASSIGNED' &&
        rfp.carrier === user?.organization?.id

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                    <li>
                        <Link to="/shipment-rfps" className="text-gray-400 hover:text-gray-500">
                            <ChevronLeftIcon className="h-5 w-5 inline mr-1" />
                            Shipment RFPs
                        </Link>
                    </li>
                    <li>
                        <span className="text-gray-500">/</span>
                    </li>
                    <li>
                        <span className="text-gray-900 font-medium">#{rfp.id.slice(-8)}</span>
                    </li>
                </ol>
            </nav>

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center space-x-3">
                        <h1 className="text-2xl font-bold text-gray-900">{rfp.title}</h1>
                        <StatusBadge status={rfp.status} size="lg" />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{rfp.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                        Created by {rfp.createdBy} on {format(new Date(rfp.createdAt), 'MMM dd, yyyy HH:mm')}
                    </div>
                </div>

                <div className="flex space-x-2">
                    {filteredActions.map((action) => (
                        <ActionButton
                            key={action.key}
                            action={action}
                            onExecute={(actionKey) => actionMutation.mutate(actionKey)}
                            loading={actionMutation.isPending}
                        />
                    ))}
                    {(isLogist || canCarrierEdit) && (
                        <Link to={`/shipment-rfps/${rfp.id}/edit`} className="btn-outline">
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit
                        </Link>
                    )}
                </div>
            </div>

            {/* Status-specific alerts */}
            {rfp.status === 'ASSIGNED' && isCarrier && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <ExclamationCircleIcon className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">
                                RFP Assigned to Your Organization
                            </h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <p>
                                    This shipment request has been assigned to your organization.
                                    Please review the details and submit your rate or confirm acceptance.
                                </p>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={() => setShowRateModal(true)}
                                    className="btn bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-500"
                                >
                                    Submit Rate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Route Information */}
                <DocumentSection title="Route & Timeline">
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Pickup Location</h4>
                            <div className="flex items-start space-x-2">
                                <MapPinIcon className="h-5 w-5 text-green-500 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-900">{rfp.pickupLocation.address}</p>
                                    <p className="text-xs text-gray-500">
                                        Contact: {rfp.pickupLocation.contactPerson} ({rfp.pickupLocation.contactPhone})
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Hours: {rfp.pickupLocation.workingHours}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Delivery Location</h4>
                            <div className="flex items-start space-x-2">
                                <MapPinIcon className="h-5 w-5 text-red-500 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-900">{rfp.deliveryLocation.address}</p>
                                    <p className="text-xs text-gray-500">
                                        Contact: {rfp.deliveryLocation.contactPerson} ({rfp.deliveryLocation.contactPhone})
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Hours: {rfp.deliveryLocation.workingHours}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-1">Pickup Date</h4>
                                <div className="flex items-center space-x-1 text-sm text-gray-600">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span>{format(new Date(rfp.timeline.pickupDate), 'MMM dd, yyyy')}</span>
                                </div>
                                {rfp.timeline.pickupTimeWindow && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Window: {rfp.timeline.pickupTimeWindow.from} - {rfp.timeline.pickupTimeWindow.to}
                                    </p>
                                )}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-1">Delivery Date</h4>
                                <div className="flex items-center space-x-1 text-sm text-gray-600">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span>{format(new Date(rfp.timeline.deliveryDate), 'MMM dd, yyyy')}</span>
                                </div>
                                {rfp.timeline.deliveryTimeWindow && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Window: {rfp.timeline.deliveryTimeWindow.from} - {rfp.timeline.deliveryTimeWindow.to}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </DocumentSection>

                {/* Cargo Information */}
                <DocumentSection title="Cargo Details">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-1">Weight</h4>
                                <div className="flex items-center space-x-1 text-sm text-gray-600">
                                    <ScaleIcon className="h-4 w-4" />
                                    <span>{rfp.cargoDetails.weight} kg</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-1">Volume</h4>
                                <p className="text-sm text-gray-600">{rfp.cargoDetails.volume} m³</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-1">Cargo Type</h4>
                            <p className="text-sm text-gray-600">{rfp.cargoDetails.cargoType}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-1">Packaging</h4>
                            <p className="text-sm text-gray-600">{rfp.cargoDetails.packagingType}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-1">Description</h4>
                            <p className="text-sm text-gray-600">{rfp.cargoDetails.description}</p>
                        </div>

                        {rfp.cargoDetails.specialRequirements.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Special Requirements</h4>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    {rfp.cargoDetails.specialRequirements.map((req, index) => (
                                        <li key={index}>{req}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </DocumentSection>
            </div>

            {/* Additional Requirements */}
            {rfp.requirements.length > 0 && (
                <DocumentSection title="Additional Requirements">
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {rfp.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                        ))}
                    </ul>
                </DocumentSection>
            )}

            {/* Attachments */}
            {rfp.attachments.length > 0 && (
                <DocumentSection title="Attachments">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {rfp.attachments.map((attachment) => (
                            <div
                                key={attachment.id}
                                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                onClick={() => documentService.downloadAttachment('shipment-rfp', 'shipment-rfp', rfp.id, attachment.id, attachment.originalName)}
                            >
                                <PaperClipIcon className="h-5 w-5 text-gray-400 mr-3" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {attachment.originalName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {(attachment.size / 1024).toFixed(1)} KB • {format(new Date(attachment.uploadedAt), 'MMM dd, yyyy')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </DocumentSection>
            )}

            {/* Rates (for carriers) */}
            {rfp.rates.length > 0 && (
                <DocumentSection title="Submitted Rates">
                    <div className="space-y-4">
                        {rfp.rates.map((rate) => (
                            <div key={rate.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">{rate.carrierName}</h4>
                                        <p className="text-lg font-semibold text-primary-600">
                                            {rate.rate} {rate.currency}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Valid until {format(new Date(rate.validUntil), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                    <StatusBadge status={rate.status as any} />
                                </div>
                                {rate.notes && (
                                    <p className="text-sm text-gray-600 mt-2">{rate.notes}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </DocumentSection>
            )}

            {/* Rate submission modal */}
            {showRateModal && (
                <Modal
                    isOpen={showRateModal}
                    onClose={() => setShowRateModal(false)}
                    title="Submit Rate"
                    size="lg"
                >
                    <div className="p-6">
                        <p>Rate submission form would go here...</p>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowRateModal(false)}
                                className="btn-outline"
                            >
                                Cancel
                            </button>
                            <button className="btn-primary">Submit Rate</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default ShipmentRfpDetailPage