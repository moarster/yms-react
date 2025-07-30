import {
    GridFilterModel,
    GridRowSelectionModel,
    GridSortModel
} from '@mui/x-data-grid'
import {useCallback, useMemo, useState} from 'react'

import {TableRow, TableSelection} from './types'

interface UseTableStateProps<TRow extends TableRow> {
    data: TRow[]
    selection: TableSelection<TRow>
}

export const useTableState = <TRow extends TableRow>({
                                                         data,
                                                         selection
                                                     }: UseTableStateProps<TRow>) => {
    // Internal state
    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>()
    const [sortModel, setSortModel] = useState<GridSortModel>([])
    const [filterModel, setFilterModel] = useState<GridFilterModel>({items: []})

    // Process data (could add filtering, sorting here if needed)
    //const processedData = useMemo(() => data, [data])
    const processedData = useMemo(() => {
        return data.map((row, index) => ({
            ...row,
            id: row.id || `row-${index}`
        }))
    }, [data])
    const handleSelectionChange = useCallback((newSelection: GridRowSelectionModel) => {
        setSelectionModel(newSelection)

        if (selection.onSelectionChange) {
            const selectedRows = data.filter(row =>
                row.id && newSelection.ids.has(row.id)
            )
            selection.onSelectionChange(selectedRows)
        }
    }, [data, selection])

    // Row click handler with proper typing
    const handleRowClick = useCallback((_params: { row: TRow }) => {
        // onRowClick is handled at the AutoTable level, not here
        // This is just for potential future expansion
    }, [])

    return {
        // State
        selectionModel,
        sortModel,
        filterModel,
        processedData,

        // Handlers
        handleSelectionChange,
        handleRowClick,
        setSortModel,
        setFilterModel,
    }
}