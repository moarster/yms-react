// components/form/layout/FormSidebar.tsx - Updated to handle items array
import React from 'react'

import { SidebarSection } from '@/types/form'

interface FormSidebarProps {
    sections: SidebarSection[]
    className?: string
}

export const FormSidebar: React.FC<FormSidebarProps> = ({
                                                            sections,
                                                            className = ''
                                                        }) => {
    if (!sections.length) return null

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'new':
            case 'draft':
                return 'bg-gray-100 text-gray-800'
            case 'assigned':
            case 'in_progress':
                return 'bg-blue-100 text-blue-800'
            case 'completed':
            case 'done':
                return 'bg-green-100 text-green-800'
            case 'cancelled':
            case 'rejected':
                return 'bg-red-100 text-red-800'
            case 'published':
                return 'bg-orange-100 text-orange-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className={`bg-white rounded-lg shadow ${className}`}>
            <div className="p-6 space-y-6">
                {sections.map((section, idx) => (
                    <div key={idx} className="last:mb-0">
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                            {section.icon && <section.icon className="h-4 w-4 mr-2" />}
                            {section.title}
                        </h4>

                        {/* Handle items array (from old sidebar hook) */}
                        {section.items && section.items.length > 0 && (
                            <div className="space-y-3">
                                {section.items.map((item, itemIdx) => (
                                    <div key={itemIdx}>
                                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            {item.label}
                                        </dt>
                                        <dd className="mt-1">
                                            {item.type === 'status' ? (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.value)}`}>
                                                    {item.value}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-gray-900">{item.value}</span>
                                            )}
                                        </dd>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Handle React content */}
                        {section.content && (
                            <div>{section.content}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}