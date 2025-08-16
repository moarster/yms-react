import { getStatusColor } from '@/types'
import { formatters } from '@/utils/format.ts'

export const cellRenderers = {
    text: (value: any) => {
        if (value === null || value === undefined) return <span className="text-gray-400">-</span>
        return <span className="truncate">{String(value)}</span>
    },

    number: (value: any) => {
        if (value === null || value === undefined) return <span className="text-gray-400">-</span>
        return <span className="font-mono">{Number(value).toLocaleString()}</span>
    },

    boolean: (value: any) => {
        return (
            <div className="flex items-center justify-center">
                {value ? (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                )}
            </div>
        )
    },

    date: (value: any) => {
        if (!value) return <span className="text-gray-400">-</span>
        return <span className="font-mono text-sm">{formatters.date(value)}</span>
    },

    status: (value: any) => {
        if (!value) return <span className="text-gray-400">-</span>
        const color = getStatusColor(value)
        const colorClasses = {
            green: 'bg-green-100 text-green-800 ring-green-600/20',
            yellow: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20',
            red: 'bg-red-100 text-red-800 ring-red-600/20',
            blue: 'bg-blue-100 text-blue-800 ring-blue-600/20',
            gray: 'bg-gray-100 text-gray-800 ring-gray-600/20',
        }[color] || 'bg-gray-100 text-gray-800 ring-gray-600/20'

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${colorClasses}`}>
                {value}
            </span>
        )
    },

    reference: (value: any) => {
        if (!value) return <span className="text-gray-400">-</span>
        const displayValue = value.title || value.entry?.title || value.name || value.id || '-'
        return (
            <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="truncate font-medium text-blue-600">{displayValue}</span>
            </div>
        )
    },

    array: (value: any) => {
        if (!Array.isArray(value)) return <span className="text-gray-400">-</span>
        if (value.length === 0) return <span className="text-gray-400">Empty</span>
        return (
            <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-xs font-medium text-gray-700">
                    {value.length} items
                </span>
                <span className="text-xs text-gray-500 truncate">
                    {value.slice(0, 2).map(v => v.title || v.name || v).join(', ')}
                    {value.length > 2 && '...'}
                </span>
            </div>
        )
    },

    auto: (value: any) => {
        if (value === null || value === undefined) return cellRenderers.text(value)
        if (typeof value === 'boolean') return cellRenderers.boolean(value)
        if (typeof value === 'number') return cellRenderers.number(value)
        if (Array.isArray(value)) return cellRenderers.array(value)
        if (typeof value === 'object' && (value.title || value.entry || value.name)) {
            return cellRenderers.reference(value)
        }
        return cellRenderers.text(value)
    }
}