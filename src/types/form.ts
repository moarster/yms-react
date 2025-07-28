import { RJSFSchema, UiSchema } from '@rjsf/utils'
import React from 'react'

type IconComponent = React.ComponentType<{ className?: string }>

export interface FormConfig {
    schema: RJSFSchema
    uiSchema?: UiSchema
    formData?: any
    disabled?: boolean
    showErrorList?: boolean
}

export interface SidebarSection {
    title: string
    icon?: IconComponent
    content: React.ReactNode
}

export interface CustomSection {
    id: string
    title: string
    icon?: IconComponent
    content: React.ReactNode
    position: 'before-form' | 'after-form'
}

export interface FormActions {
    primary?: {
        label: string
        onClick: () => void
        loading?: boolean
        disabled?: boolean
    }
    secondary?: {
        label: string
        onClick: () => void
        disabled?: boolean
    }
    additional?: Array<{
        label: string
        onClick: () => void
        variant?: 'outline' | 'danger' | 'success'
        disabled?: boolean
    }>
}

export interface CommonFormProps {
    title: string
    subtitle?: string
    breadcrumbs?: Array<{ label: string; href?: string }>

    // Form configuration
    formConfig: FormConfig
    onFormChange: (data: any) => void
    onFormSubmit: (data: any) => void

    // Layout customization
    sidebarSections?: SidebarSection[]
    customSections?: CustomSection[]

    // Header actions (edit, save, cancel buttons)
    actions?: FormActions

    // Loading states
    isLoading?: boolean
    isSubmitting?: boolean

    // Edit mode toggle
    isEditMode?: boolean
    onEditModeChange?: (editMode: boolean) => void

    // Additional customization
    className?: string
    hideFormActions?: boolean
}