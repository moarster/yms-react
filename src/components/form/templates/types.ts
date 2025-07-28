export interface FieldTemplateProps {
    id: string
    label: string
    help?: string
    required?: boolean
    errors?: string
    children: React.ReactNode
    schema: any
    formData?: any
    onChange: (value: any) => void
    name?: string
    disabled?: boolean
}

export interface FieldLayoutConfig {
    wrapperClass: string
    labelClass: string
}