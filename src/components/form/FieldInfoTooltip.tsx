import React, { useState } from 'react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import ReactMarkdown from 'react-markdown'

interface FieldInfoTooltipProps {
    content: string
    className?: string
}

const FieldInfoTooltip: React.FC<FieldInfoTooltipProps> = ({
                                                               content,
                                                               className = ''
                                                           }) => {
    const [isVisible, setIsVisible] = useState(false)

    if (!content?.trim()) return null

    return (
        <div className={`relative inline-block ${className}`}>
            <button
                type="button"
                className="inline-flex items-center justify-center w-4 h-4 ml-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onFocus={() => setIsVisible(true)}
                onBlur={() => setIsVisible(false)}
                tabIndex={0}
            >
                <InformationCircleIcon className="w-4 h-4" />
            </button>

            {isVisible && (
                <div className="absolute z-50 w-80 p-3 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg left-0 top-full">
                    {/* Arrow pointing up */}
                    <div className="absolute -top-1 left-2 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45"></div>

                    {/* Content */}
                    <div className="prose prose-sm max-w-none">
                        <ReactMarkdown
                            components={{
                                // Customize markdown components for tooltip
                                p: ({ children }) => <p className="text-sm text-gray-700 mb-2 last:mb-0">{children}</p>,
                                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                                em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
                                code: ({ children }) => (
                                    <code className="px-1 py-0.5 bg-gray-100 text-gray-800 rounded text-xs font-mono">
                                        {children}
                                    </code>
                                ),
                                ul: ({ children }) => <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">{children}</ol>,
                                li: ({ children }) => <li className="text-sm">{children}</li>,
                                h1: ({ children }) => <h1 className="text-base font-semibold text-gray-900 mb-2">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-sm font-semibold text-gray-900 mb-1">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-sm font-medium text-gray-900 mb-1">{children}</h3>,
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-2 border-gray-300 pl-3 text-sm text-gray-600 italic">
                                        {children}
                                    </blockquote>
                                ),
                                a: ({ children, href }) => (
                                    <a
                                        href={href}
                                        className="text-primary-600 hover:text-primary-800 underline text-sm"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {children}
                                    </a>
                                ),
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FieldInfoTooltip