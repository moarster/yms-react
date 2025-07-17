import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import {
    ChevronLeftIcon,
    MapPinIcon,
    ScaleIcon,
    DocumentIcon,
    PaperClipIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { documentService } from '@/services/documentService'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { ShipmentRfp } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

// Form validation schema
const rfpSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    pickupLocation: z.object({
        address: z.string().min(1, 'Pickup address is required'),
        contactPerson: z.string().min(1, 'Contact person is required'),
        contactPhone: z.string().min(1, 'Contact phone is required'),
        workingHours: z.string().min(1, 'Working hours are required'),
    }),
    deliveryLocation: z.object({
        address: z.string().min(1, 'Delivery address is required'),
        contactPerson: z.string().min(1, 'Contact person is required'),
        contactPhone: z.string().min(1, 'Contact phone is required'),
        workingHours: z.string().min(1, 'Working hours are required'),
    }),
    cargoDetails: z.object({
        weight: z.number().min(0.1, 'Weight must be greater than 0'),
        volume: z.number().min(0.1, 'Volume must be greater than 0'),
        description: z.string().min(1, 'Cargo description is required'),
        cargoType: z.string().min(1, 'Cargo type is required'),
        packagingType: z.string().min(1, 'Packaging type is required'),
        specialRequirements: z.array(z.string()).optional(),
    }),
    timeline: z.object({
        pickupDate: z.string().min(1, 'Pickup date is required'),
        deliveryDate: z.string().min(1, 'Delivery date is required'),
        pickupTimeWindow: z.object({
            from: z.string().optional(),
            to: z.string().optional(),
        }).optional(),
        deliveryTimeWindow: z.object({
            from: z.string().optional(),
            to: z.string().optional(),
        }).optional(),
    }),
    requirements: z.array(z.string()).optional(),
})

type RfpFormData = z.infer<typeof rfpSchema>

interface FormSectionProps {
    title: string
    icon: React.ComponentType<{ className?: string }>
    children: React.ReactNode
}

const FormSection: React.FC<FormSectionProps> = ({ title, icon: Icon, children }) => (
    <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
                <Icon className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
        </div>
        <div className="p-6">{children}</div>
    </div>
)

const CreateShipmentRfpPage: React.FC = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { addNotification } = useUiStore()
    const [attachments, setAttachments] = useState<File[]>([])
    const [requirements, setRequirements] = useState<string[]>([])
    const [newRequirement, setNewRequirement] = useState('')
    const [specialRequirements, setSpecialRequirements] = useState<string[]>([])
    const [newSpecialRequirement, setNewSpecialRequirement] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<RfpFormData>({
        resolver: zodResolver(rfpSchema),
        defaultValues: {
            requirements: [],
            cargoDetails: {
                specialRequirements: [],
            },
        },
    })

    // Create RFP mutation
    const createMutation = useMutation({
        mutationFn: async (data: RfpFormData) => {
            const rfpData: Omit<ShipmentRfp, 'id' | 'createdAt' | 'updatedAt' | 'version'> = {
                type: 'shipment-rfp',
                status: 'DRAFT',
                createdBy: user!.id,
                title: data.title,
                description: data.description,
                pickupLocation: data.pickupLocation,
                deliveryLocation: data.deliveryLocation,
                cargoDetails: {
                    ...data.cargoDetails,
                    specialRequirements: specialRequirements,
                },
                timeline: data.timeline,
                requirements: requirements,
                attachments: [], // Will be uploaded separately
                rates: [],
                accessRules: [], // Will be set by backend based on business rules
            }

            const response = await documentService.createShipmentRfp(rfpData)
            return response.data
        },
        onSuccess: (createdRfp) => {
            toast.success('RFP created successfully')
            addNotification({
                type: 'success',
                title: 'RFP Created',
                message: `Shipment RFP "${createdRfp.title}" has been created successfully`,
            })
            navigate(`/shipment-rfps/${createdRfp.id}`)
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create RFP')
        },
    })

    const onSubmit = (data: RfpFormData) => {
        createMutation.mutate(data)
    }

    const addRequirement = () => {
        if (newRequirement.trim()) {
            setRequirements([...requirements, newRequirement.trim()])
            setNewRequirement('')
        }
    }

    const removeRequirement = (index: number) => {
        setRequirements(requirements.filter((_, i) => i !== index))
    }

    const addSpecialRequirement = () => {
        if (newSpecialRequirement.trim()) {
            setSpecialRequirements([...specialRequirements, newSpecialRequirement.trim()])
            setNewSpecialRequirement('')
        }
    }

    const removeSpecialRequirement = (index: number) => {
        setSpecialRequirements(specialRequirements.filter((_, i) => i !== index))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments([...attachments, ...Array.from(e.target.files)])
        }
    }

    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index))
    }

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
                        <span className="text-gray-900 font-medium">Create New RFP</span>
                    </li>
                </ol>
            </nav>

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Create Shipment RFP</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Create a new shipment request for proposal to find suitable carriers
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <FormSection title="Basic Information" icon={DocumentIcon}>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="label">Title *</label>
                            <input
                                {...register('title')}
                                type="text"
                                className={errors.title ? 'input-error' : 'input'}
                                placeholder="Enter RFP title"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="label">Description *</label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                className={errors.description ? 'input-error' : 'input'}
                                placeholder="Provide a detailed description of the shipment requirements"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                            )}
                        </div>
                    </div>
                </FormSection>

                {/* Route Information */}
                <FormSection title="Route & Timeline" icon={MapPinIcon}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pickup Location */}
                        <div>
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Pickup Location</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="label">Address *</label>
                                    <input
                                        {...register('pickupLocation.address')}
                                        type="text"
                                        className={errors.pickupLocation?.address ? 'input-error' : 'input'}
                                        placeholder="Enter pickup address"
                                    />
                                    {errors.pickupLocation?.address && (
                                        <p className="mt-1 text-sm text-red-600">{errors.pickupLocation.address.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Contact Person *</label>
                                        <input
                                            {...register('pickupLocation.contactPerson')}
                                            type="text"
                                            className={errors.pickupLocation?.contactPerson ? 'input-error' : 'input'}
                                            placeholder="Contact name"
                                        />
                                        {errors.pickupLocation?.contactPerson && (
                                            <p className="mt-1 text-sm text-red-600">{errors.pickupLocation.contactPerson.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="label">Phone *</label>
                                        <input
                                            {...register('pickupLocation.contactPhone')}
                                            type="tel"
                                            className={errors.pickupLocation?.contactPhone ? 'input-error' : 'input'}
                                            placeholder="+7 (XXX) XXX-XX-XX"
                                        />
                                        {errors.pickupLocation?.contactPhone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.pickupLocation.contactPhone.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Working Hours *</label>
                                    <input
                                        {...register('pickupLocation.workingHours')}
                                        type="text"
                                        className={errors.pickupLocation?.workingHours ? 'input-error' : 'input'}
                                        placeholder="e.g., Mon-Fri 9:00-18:00"
                                    />
                                    {errors.pickupLocation?.workingHours && (
                                        <p className="mt-1 text-sm text-red-600">{errors.pickupLocation.workingHours.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="label">Pickup Date *</label>
                                    <input
                                        {...register('timeline.pickupDate')}
                                        type="date"
                                        className={errors.timeline?.pickupDate ? 'input-error' : 'input'}
                                    />
                                    {errors.timeline?.pickupDate && (
                                        <p className="mt-1 text-sm text-red-600">{errors.timeline.pickupDate.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Time Window From</label>
                                        <input
                                            {...register('timeline.pickupTimeWindow.from')}
                                            type="time"
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Time Window To</label>
                                        <input
                                            {...register('timeline.pickupTimeWindow.to')}
                                            type="time"
                                            className="input"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Location */}
                        <div>
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Delivery Location</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="label">Address *</label>
                                    <input
                                        {...register('deliveryLocation.address')}
                                        type="text"
                                        className={errors.deliveryLocation?.address ? 'input-error' : 'input'}
                                        placeholder="Enter delivery address"
                                    />
                                    {errors.deliveryLocation?.address && (
                                        <p className="mt-1 text-sm text-red-600">{errors.deliveryLocation.address.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Contact Person *</label>
                                        <input
                                            {...register('deliveryLocation.contactPerson')}
                                            type="text"
                                            className={errors.deliveryLocation?.contactPerson ? 'input-error' : 'input'}
                                            placeholder="Contact name"
                                        />
                                        {errors.deliveryLocation?.contactPerson && (
                                            <p className="mt-1 text-sm text-red-600">{errors.deliveryLocation.contactPerson.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="label">Phone *</label>
                                        <input
                                            {...register('deliveryLocation.contactPhone')}
                                            type="tel"
                                            className={errors.deliveryLocation?.contactPhone ? 'input-error' : 'input'}
                                            placeholder="+7 (XXX) XXX-XX-XX"
                                        />
                                        {errors.deliveryLocation?.contactPhone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.deliveryLocation.contactPhone.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Working Hours *</label>
                                    <input
                                        {...register('deliveryLocation.workingHours')}
                                        type="text"
                                        className={errors.deliveryLocation?.workingHours ? 'input-error' : 'input'}
                                        placeholder="e.g., Mon-Fri 9:00-18:00"
                                    />
                                    {errors.deliveryLocation?.workingHours && (
                                        <p className="mt-1 text-sm text-red-600">{errors.deliveryLocation.workingHours.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="label">Delivery Date *</label>
                                    <input
                                        {...register('timeline.deliveryDate')}
                                        type="date"
                                        className={errors.timeline?.deliveryDate ? 'input-error' : 'input'}
                                    />
                                    {errors.timeline?.deliveryDate && (
                                        <p className="mt-1 text-sm text-red-600">{errors.timeline.deliveryDate.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Time Window From</label>
                                        <input
                                            {...register('timeline.deliveryTimeWindow.from')}
                                            type="time"
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Time Window To</label>
                                        <input
                                            {...register('timeline.deliveryTimeWindow.to')}
                                            type="time"
                                            className="input"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FormSection>

                {/* Cargo Details */}
                <FormSection title="Cargo Details" icon={ScaleIcon}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Weight (kg) *</label>
                                    <input
                                        {...register('cargoDetails.weight', { valueAsNumber: true })}
                                        type="number"
                                        step="0.1"
                                        className={errors.cargoDetails?.weight ? 'input-error' : 'input'}
                                        placeholder="0.0"
                                    />
                                    {errors.cargoDetails?.weight && (
                                        <p className="mt-1 text-sm text-red-600">{errors.cargoDetails.weight.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="label">Volume (m³) *</label>
                                    <input
                                        {...register('cargoDetails.volume', { valueAsNumber: true })}
                                        type="number"
                                        step="0.1"
                                        className={errors.cargoDetails?.volume ? 'input-error' : 'input'}
                                        placeholder="0.0"
                                    />
                                    {errors.cargoDetails?.volume && (
                                        <p className="mt-1 text-sm text-red-600">{errors.cargoDetails.volume.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="label">Cargo Type *</label>
                                <select
                                    {...register('cargoDetails.cargoType')}
                                    className={errors.cargoDetails?.cargoType ? 'input-error' : 'input'}
                                >
                                    <option value="">Select cargo type</option>
                                    <option value="general">General Cargo</option>
                                    <option value="fragile">Fragile</option>
                                    <option value="perishable">Perishable</option>
                                    <option value="hazardous">Hazardous</option>
                                    <option value="oversized">Oversized</option>
                                </select>
                                {errors.cargoDetails?.cargoType && (
                                    <p className="mt-1 text-sm text-red-600">{errors.cargoDetails.cargoType.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="label">Packaging Type *</label>
                                <select
                                    {...register('cargoDetails.packagingType')}
                                    className={errors.cargoDetails?.packagingType ? 'input-error' : 'input'}
                                >
                                    <option value="">Select packaging type</option>
                                    <option value="boxes">Boxes</option>
                                    <option value="pallets">Pallets</option>
                                    <option value="containers">Containers</option>
                                    <option value="bulk">Bulk</option>
                                </select>
                                {errors.cargoDetails?.packagingType && (
                                    <p className="mt-1 text-sm text-red-600">{errors.cargoDetails.packagingType.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="label">Description *</label>
                                <textarea
                                    {...register('cargoDetails.description')}
                                    rows={3}
                                    className={errors.cargoDetails?.description ? 'input-error' : 'input'}
                                    placeholder="Describe the cargo in detail"
                                />
                                {errors.cargoDetails?.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.cargoDetails.description.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="label">Special Requirements</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newSpecialRequirement}
                                        onChange={(e) => setNewSpecialRequirement(e.target.value)}
                                        className="input flex-1"
                                        placeholder="Add special requirement"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialRequirement())}
                                    />
                                    <button
                                        type="button"
                                        onClick={addSpecialRequirement}
                                        className="btn-outline"
                                    >
                                        Add
                                    </button>
                                </div>
                                {specialRequirements.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {specialRequirements.map((req, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                <span className="text-sm">{req}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSpecialRequirement(index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <XMarkIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </FormSection>

                {/* Additional Requirements */}
                <FormSection title="Additional Requirements" icon={DocumentIcon}>
                    <div>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={newRequirement}
                                onChange={(e) => setNewRequirement(e.target.value)}
                                className="input flex-1"
                                placeholder="Add requirement"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                            />
                            <button
                                type="button"
                                onClick={addRequirement}
                                className="btn-outline"
                            >
                                Add
                            </button>
                        </div>
                        {requirements.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {requirements.map((req, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                        <span>{req}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeRequirement(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </FormSection>

                {/* Attachments */}
                <FormSection title="Attachments" icon={PaperClipIcon}>
                    <div>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="input"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
                        </p>
                        {attachments.length > 0 && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {attachments.map((file, index) => (
                                    <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg">
                                        <PaperClipIcon className="h-5 w-5 text-gray-400 mr-3" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(index)}
                                            className="ml-2 text-red-600 hover:text-red-800"
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </FormSection>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <Link to="/shipment-rfps" className="btn-outline">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="btn-primary"
                    >
                        {createMutation.isPending ? (
                            <>
                                <LoadingSpinner size="sm" />
                                <span className="ml-2">Creating...</span>
                            </>
                        ) : (
                            'Create RFP'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateShipmentRfpPage