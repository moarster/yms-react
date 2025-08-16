import React, {useEffect, useRef} from 'react'
import {RenderEditCellProps} from 'react-data-grid'

export const TextEditor: React.FC<RenderEditCellProps<any>> = (props) => {
    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        ref.current?.focus()
        ref.current?.select()
    }, [])

    return (
        <input
            ref={ref}
            className="w-full h-full px-2 py-1 border-0 outline-none focus:ring-2 focus:ring-blue-500"
            value={props.row[props.column.key] || ''}
            onChange={e => props.onRowChange({...props.row, [props.column.key]: e.target.value})}
            onBlur={() => props.onClose(true)}
        />
    )
}

export const NumberEditor: React.FC<RenderEditCellProps<any>> = (props) => {
    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        ref.current?.focus()
        ref.current?.select()
    }, [])

    return (
        <input
            ref={ref}
            type="number"
            className="w-full h-full px-2 py-1 border-0 outline-none focus:ring-2 focus:ring-blue-500"
            value={props.row[props.column.key] || 0}
            onChange={e => props.onRowChange({...props.row, [props.column.key]: Number(e.target.value)})}
            onBlur={() => props.onClose(true)}
        />
    )
}

export const BooleanEditor: React.FC<RenderEditCellProps<any>> = (props) => {
    return (
        <div className="flex items-center justify-center h-full">
            <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                checked={props.row[props.column.key] || false}
                onChange={e => {
                    props.onRowChange({...props.row, [props.column.key]: e.target.checked})
                    props.onClose(true)
                }}
                autoFocus
            />
        </div>
    )
}

interface SelectEditorProps extends RenderEditCellProps<any> {
    options: any[]
}

export const SelectEditor: React.FC<SelectEditorProps> = ({options, ...props}) => {
    const ref = useRef<HTMLSelectElement>(null)

    useEffect(() => {
        ref.current?.focus()
    }, [])

    return (
        <select
            ref={ref}
            className="w-full h-full px-2 py-1 border-0 outline-none focus:ring-2 focus:ring-blue-500"
            value={props.row[props.column.key] || ''}
            onChange={e => {
                props.onRowChange({...props.row, [props.column.key]: e.target.value})
                props.onClose(true)
            }}
            onBlur={() => props.onClose(false)}
        >
            <option value="">Select...</option>
            {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
    )
}

export const DateEditor: React.FC<RenderEditCellProps<any>> = (props) => {
    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        ref.current?.focus()
    }, [])

    return (
        <input
            ref={ref}
            type="date"
            className="w-full h-full px-2 py-1 border-0 outline-none focus:ring-2 focus:ring-blue-500"
            value={props.row[props.column.key] || ''}
            onChange={e => props.onRowChange({...props.row, [props.column.key]: e.target.value})}
            onBlur={() => props.onClose(true)}
        />
    )
}

