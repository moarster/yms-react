import { useMemo } from 'react'

import { SidebarSection } from '@/types/form'

interface SidebarFieldConfig {
    key: string
    label: string
    type?: 'status' | 'date' | 'user' | 'text'
    icon?: React.ComponentType<{ className?: string }>
}

interface SidebarSectionConfig {
    title: string
    icon?: React.ComponentType<{ className?: string }>
    fields: SidebarFieldConfig[]
    condition?: (document: any) => boolean
}

interface UseDocumentSidebarProps {
    document: any
    sectionConfigs: SidebarSectionConfig[]
}

export const useDocumentSidebar = ({
                                       document,
                                       sectionConfigs
                                   }: UseDocumentSidebarProps) => {

    const sidebarSections: SidebarSection[] = useMemo(() => {
        if (!document) return []

        return sectionConfigs
            .filter(config => !config.condition || config.condition(document))
            .map(config => ({
                title: config.title,
                icon: config.icon,
                items: config.fields
                    .filter(field => {
                        const value = getNestedValue(document, field.key)
                        return value !== null && value !== undefined && value !== ''
                    })
                    .map(field => ({
                        label: field.label,
                        value: formatFieldValue(getNestedValue(document, field.key), field.type),
                        type: field.type
                    }))
            }))
            .filter(section => section.items && section.items.length > 0)
    }, [document, sectionConfigs])

    return { sidebarSections }
}

// Helper functions
function getNestedValue(obj: object, path: string): object {
    return path.split('.').reduce((current, key) => current?.[key], obj)
}

function formatFieldValue(value: string, type?: string): string {
    if (value === null || value === undefined) return ''

    switch (type) {
        case 'date':
            return new Date(value).toLocaleDateString()
        // case 'user':
        //     return typeof value === 'object' ? (value.name || value.email) : value
        default:
            return String(value)
    }
}