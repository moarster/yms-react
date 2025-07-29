import {JsonSchema} from "@/services/schemaService.ts";

export interface FieldTemplateProps {
    id: string
    label: string
    help?: string
    required?: boolean
    errors?: string
    children: React.ReactNode
    schema: JsonSchema
    formData?: object
    onChange: (value: object) => void
    name?: string
    disabled?: boolean
}

export interface FieldLayoutConfig {
    wrapperClass: string
    labelClass: string
}