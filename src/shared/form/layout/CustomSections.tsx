import React from 'react'

interface CustomSection {
    id: string
    title: string
    icon?: React.ComponentType<{ className?: string }>
    content: React.ReactNode
    position: 'before-form' | 'after-form'
}

interface CustomSectionsProps {
    sections: CustomSection[]
    position: 'before-form' | 'after-form'
}

export const CustomSections: React.FC<CustomSectionsProps> = ({ sections, position }) => {
    const filteredSections = sections.filter(s => s.position === position)

    if (filteredSections.length === 0) return null

    return (
        <>
            {filteredSections.map((section) => (
                <div key={section.id} className="card">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                            {section.icon && <section.icon className="h-5 w-5 text-gray-400" />}
                            <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                        </div>
                    </div>
                    <div className="p-6">{section.content}</div>
                </div>
            ))}
        </>
    )
}