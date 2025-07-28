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
    content?: React.ReactNode
    items?: Array<{ label: string; value: string; type?: string }>
}

export interface CustomSection {
    id: string
    title: string
    icon?: IconComponent
    content: React.ReactNode
    position: 'before-form' | 'after-form'
}

export interface FormAction {
    label: string
    onClick: () => void
    loading?: boolean
    disabled?: boolean
    icon?: IconComponent
}

export interface FormActions {
    edit?: FormAction
    save?: FormAction
    cancel?: FormAction
    delete?: FormAction
    additional?: Array<FormAction & {
        variant?: 'outline' | 'danger' | 'success'
    }>
}

export interface WorkflowTask {
    label: string
    onClick: () => void
    loading?: boolean
    disabled?: boolean
    icon?: IconComponent
    variant?: 'primary' | 'secondary' | 'danger' | 'success'
    requiresConfirmation?: boolean
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

    // Header - Form Actions (edit, save, cancel)
    formActions?: FormActions

    // Footer - Workflow Tasks (publish, assign, etc.)
    workflowTasks?: WorkflowTask[]

    // Loading states
    isLoading?: boolean
    isSubmitting?: boolean

    // Edit mode toggle
    isEditMode?: boolean
    onEditModeChange?: (editMode: boolean) => void

    // Additional customization
    className?: string
}