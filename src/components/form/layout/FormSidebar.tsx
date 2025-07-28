import React from 'react'

interface SidebarSection {
    title: string
    icon?: React.ComponentType<{ className?: string }>
    content: React.ReactNode
}

interface FormSidebarProps {
    sections: SidebarSection[]
}

export const FormSidebar: React.FC<FormSidebarProps> = ({ sections }) => {
    if (sections.length === 0) return null

    return (
        <div className="space-y-6">
            {sections.map((section, index) => (
                <div key={index} className="card">
                    <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                            {section.icon && <section.icon className="h-5 w-5 text-gray-400" />}
                            <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
                        </div>
                    </div>
                    <div className="p-4">{section.content}</div>
                </div>
            ))}
        </div>
    )
}