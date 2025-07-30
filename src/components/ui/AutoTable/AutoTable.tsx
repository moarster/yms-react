import { Box, ThemeProvider } from '@mui/material'
import { DataGrid, GridRowParams } from '@mui/x-data-grid'
import  { useCallback, useMemo } from 'react'

import DataGridErrorBoundary from '../DataGridErrorBoundary'
import { generateColumns } from './columnGenerator'
import { createOverlaySlots } from './overlayUtils'
import { autoTableTheme, tableStyles } from './theme'
import { AutoTableProps, TableRow } from './types'
import { useTableState } from './useTableState'

const AutoTable = <TRow extends TableRow = TableRow>({
                                                         data,
                                                         schema,
                                                         config = {},
                                                         loading = false,
                                                         className,
                                                         height = 600,
                                                         enableBulkActions = false,
                                                         enableActions = false,
                                                         density = 'standard',
                                                         onEdit,
                                                         onDelete,
                                                         onView,
                                                         onRowClick,
                                                         onSelectionChange,
                                                     }: AutoTableProps<TRow>) => {


    const actions = useMemo(() => ({
        onEdit,
        onDelete,
        onView,
        onRowClick,
    }), [onEdit, onDelete, onView, onRowClick])


    const selection = useMemo(() => ({
        onSelectionChange,
        enableBulkActions,
    }), [onSelectionChange, enableBulkActions])


    const {
        selectionModel,
        sortModel,
        filterModel,
        processedData,
        handleSelectionChange,
        setSortModel,
        setFilterModel,
    } = useTableState({ data, selection })

    // Generate columns based on schema or data
    const columns = useMemo(() =>
            generateColumns(schema, data, actions, enableActions),
        [schema, data, actions, enableActions]
    )


    const handleRowClick = useCallback((params: GridRowParams<TRow>) => {
        if (onRowClick) {
            onRowClick(params.row)
        }
    }, [onRowClick])

    // Create overlay slots
    const slots = useMemo(() => createOverlaySlots(), [])

    return (
        <DataGridErrorBoundary>
            <ThemeProvider theme={autoTableTheme}>
                <Box
                    sx={tableStyles.container}
                    className={className}
                    height={height}
                >
                    <DataGrid<TRow>
                        // Data
                        rows={processedData}
                        columns={columns}
                        loading={loading}

                        // Selection
                        checkboxSelection={enableBulkActions}
                        rowSelectionModel={selectionModel}
                        onRowSelectionModelChange={handleSelectionChange}

                        // Interaction
                        onRowClick={handleRowClick}
                        disableRowSelectionOnClick={enableBulkActions}

                        // Sorting and filtering
                        sortModel={sortModel}
                        onSortModelChange={setSortModel}
                        filterModel={filterModel}
                        onFilterModelChange={setFilterModel}

                        // Pagination
                        pagination={true}
                        paginationMode="client"
                        pageSizeOptions={[10, 25, 50, 100]}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    page: 0,
                                    pageSize: config.pageSize || 25,
                                },
                            },
                        }}

                        // Appearance
                        density={density}
                        slots={slots}

                        // Performance and error handling
                        disableColumnMenu={false}
                        disableColumnSelector={false}
                        disableDensitySelector={false}

                        // Hide footer if no data to prevent state errors
                        //hideFooter={processedData.length === 0 && loading}
                        hideFooter={config.pagination === false && !loading}
                        // Styling
                        sx={{
                            ...tableStyles.dataGrid,
                            '& .MuiDataGrid-row:hover': {
                                cursor: onRowClick ? 'pointer' : 'default',
                            },
                            minHeight: processedData.length === 0 ? 400 : 'auto',
                        }}
                    />
                </Box>
            </ThemeProvider>
        </DataGridErrorBoundary>
    )
}

export default AutoTable