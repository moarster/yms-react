import { useQuery } from '@tanstack/react-query'
import { useMemo,useState } from 'react'

import { TableRow } from '@/shared/ui/AutoTable/types.ts'

import {
    TableMode,
    TablePageHookConfig,
    UseTablePageResult} from '../tablePage.types.ts'

export function useTablePage<TRow extends TableRow = TableRow>(
    config: TablePageHookConfig<TRow>
): UseTablePageResult<TRow> {
    const { dataFetch, schemaFetch, pageConfig, actions } = config
    const [selectedItems, setSelectedItems] = useState<TRow[]>([])

    // Fetch main data
    const {
        data: rawData,
        isLoading: dataLoading,
        error: dataError
    } = useQuery({
        queryKey: dataFetch.queryKey,
        queryFn: dataFetch.fetchFn,
        enabled: dataFetch.enabled !== false
    })

    // Fetch schema if configured
    const {
        data: schema,
        isLoading: schemaLoading
    } = useQuery({
        queryKey: schemaFetch?.queryKey || [],
        queryFn: schemaFetch?.fetchFn || (() => Promise.resolve(undefined)),
        enabled: !!schemaFetch && schemaFetch.enabled !== false
    })

    // Transform data if needed
    const data = useMemo(() => {
        if (!rawData) return []
        return dataFetch.transformData ? dataFetch.transformData(rawData) : rawData
    }, [rawData, dataFetch.transformData])

    // Determine loading state
    const loading = dataLoading || (schemaFetch ? schemaLoading : false)

    // Build table props based on mode
    const tableProps = useMemo(() => {
        const props: any = {
            data,
            schema,
            loading,
            height: pageConfig.height,
            config: pageConfig.tableConfig
        }

        // Handle different modes
        switch (pageConfig.mode) {
            case TableMode.EDITABLE:
                props.onEdit = actions?.onEdit
                props.onDelete = actions?.onDelete
                props.enableBulkActions = pageConfig.enableBulkActions
                props.onSelectionChange = setSelectedItems
                break

            case TableMode.CLICKABLE:
                props.onRowClick = actions?.onRowClick
                props.enableBulkActions = pageConfig.enableBulkActions
                props.onSelectionChange = pageConfig.enableBulkActions ? setSelectedItems : undefined
                break

            case TableMode.READONLY:
                props.onView = actions?.onView
                break
        }

        return props
    }, [data, schema, loading, pageConfig, actions])

    return {
        data,
        schema,
        loading,
        error: dataError,
        selectedItems,
        setSelectedItems,
        tableProps
    }
}