// noinspection t

import React, {useMemo, useCallback, useState} from 'react'
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
    GridSortModel,
    GridFilterModel,
    GridRowParams,
    GridValueGetterParams,
    GridRenderCellParams,
    GridToolbar,
    GridSlots,
    GridActionsCellItem,
    GridRowId
} from '@mui/x-data-grid'
import {
    Box,
    Chip,
    Typography,
    IconButton,
    Tooltip,
    LinearProgress,
    ThemeProvider,
    createTheme
} from '@mui/material'
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon
} from '@mui/icons-material'
import {JsonSchema, JsonSchemaProperty, TableConfig} from '@/services/schemaService'
import {format} from 'date-fns'
import DataGridErrorBoundary from './DataGridErrorBoundary'

interface AutoTableProps {
    data: any[]
    schema: JsonSchema
    config?: Partial<TableConfig>
    loading?: boolean
    onRowClick?: (data: any) => void
    onSelectionChange?: (selectedRows: any[]) => void
    onDataChange?: (data: any[]) => void
    onEdit?: (row: any) => void
    onDelete?: (row: any) => void
    onView?: (row: any) => void
    className?: string
    height?: number | string
    enableBulkActions?: boolean
    enableActions?: boolean
    showToolbar?: boolean
    density?: 'compact' | 'standard' | 'comfortable'
}

const muiTheme = createTheme({
    palette: {
        primary: {
            main: '#2563eb', // blue-600
        },
        secondary: {
            main: '#64748b', // slate-500
        },
        background: {
            default: '#ffffff',
            paper: '#f8fafc', // slate-50
        },
        text: {
            primary: '#0f172a', // slate-900
            secondary: '#64748b', // slate-500
        },
    },
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: '1px solid #e2e8f0', // slate-200
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    '& .MuiDataGrid-cell': {
                        borderColor: '#f1f5f9', // slate-100
                        fontSize: '14px',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f8fafc', // slate-50
                        borderBottom: '2px solid #e2e8f0',
                        '& .MuiDataGrid-columnHeader': {
                            fontWeight: 600,
                            fontSize: '14px',
                            color: '#374151', // gray-700
                        },
                    },
                    '& .MuiDataGrid-row': {
                        '&:hover': {
                            backgroundColor: '#f0f9ff', // sky-50
                        },
                        '&.Mui-selected': {
                            backgroundColor: '#dbeafe', // blue-100
                            '&:hover': {
                                backgroundColor: '#bfdbfe', // blue-200
                            },
                        },
                    },
                    '& .MuiDataGrid-footerContainer': {
                        borderTop: '1px solid #e2e8f0',
                        backgroundColor: '#f8fafc',
                    },
                },
            },
        },
    },
})
const StatusCellRenderer = ({value}: GridRenderCellParams) => {
    if (!value) return null

    const statusColors = {
        NEW: {bg: '#f3f4f6', text: '#374151'}, // gray
        ASSIGNED: {bg: '#dbeafe', text: '#1d4ed8'}, // blue
        CLOSED: {bg: '#dcfce7', text: '#166534'}, // green
        CANCELLED: {bg: '#fee2e2', text: '#dc2626'}, // red
    }

    const colors = statusColors[value as keyof typeof statusColors] || statusColors.NEW

    return (
        <Chip
            label={value}
            size="small"
            sx={{
                backgroundColor: colors.bg,
                color: colors.text,
                fontWeight: 500,
                fontSize: '12px',
                height: '24px',
            }}
        />
    )
}
const DateCellRenderer = ({value}: GridRenderCellParams) => {
    if (!value) return null
    try {
        return format(new Date(value), 'dd.MM.yyyy HH:mm')
    } catch {
        return value
    }
}
const ReferenceCellRenderer = ({value}: GridRenderCellParams) => {
    if (!value) return null
    if (typeof value === 'object' && (value?.title || value?.entry?.title)) {
        return (value?.title || value?.entry?.title || '')
    }
    return value.toString()
}

const ArrayCellRenderer = ({value}: GridRenderCellParams) => {
    if (!Array.isArray(value) || value.length === 0) return null

    if (value.length === 1) {
        const item = value[0]
        return typeof item === 'object' && item.title ? item.title : item.toString()
    }

    return (
        <Tooltip title={value.map(item =>
            typeof item === 'object' && item.title ? item.title : item.toString()
        ).join(', ')}>
            <Chip
                label={`${value.length} items`}
                size="small"
                variant="outlined"
            />
        </Tooltip>
    )
}
const BooleanCellRenderer = ({value}: GridRenderCellParams) => {
    return (
        <Chip
            label={value ? '✓' : '✗'}
            size="small"
            color={value ? 'success' : 'default'}
            variant="outlined"
        />
    )
}
const SelectCellEditor = (props: any) => {
    const {value, onValueChange, enumValues} = props

    return (
        <select
            value={value || ''}
            onChange={(e) => onValueChange(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="">Select...</option>
            {enumValues?.map((option: any) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}


const generateColumnDefs = (
    properties: Record<string, JsonSchemaProperty>,
    enableActions: boolean,
    onEdit?: (row: any) => void,
    onDelete?: (row: any) => void,
    onView?: (row: any) => void
): GridColDef[] => {
    const columns: GridColDef[] = []

    Object.entries(properties || {}).forEach(([key, property]) => {
        // Skip hidden fields
        if (property['x-table-hidden']) return

        // Skip complex objects (nested properties) but keep references
        if (property.type === 'object' && !key.startsWith('_')) return

        const colDef: GridColDef = {
            field: key,
            headerName: property.title || key,
            sortable: property['x-table-sortable'] !== false,
            filterable: property['x-table-filterable'] !== false,
            editable: property['x-table-editable'] === true,
            width: property['x-table-width'] || getDefaultWidth(property),
            flex: property['x-table-width'] ? 0 : 1,
            minWidth: 100,
            ...getColumnConfig(property)
        }

        columns.push(colDef)
    })

    // Add actions column if enabled
    if (enableActions && (onEdit || onDelete || onView)) {
        const actionsColumn: GridColDef = {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 120,
            cellClassName: 'actions',
            getActions: ({row}) => {
                const actions = []

                if (onView) {
                    actions.push(
                        <GridActionsCellItem
                            icon={<ViewIcon/>}
                            label="View"
                            onClick={() => onView(row)}
                            color="inherit"
                        />
                    )
                }

                if (onEdit) {
                    actions.push(
                        <GridActionsCellItem
                            icon={<EditIcon/>}
                            label="Edit"
                            onClick={() => onEdit(row)}
                            color="inherit"
                        />
                    )
                }

                if (onDelete) {
                    actions.push(
                        <GridActionsCellItem
                            icon={<DeleteIcon/>}
                            label="Delete"
                            onClick={() => onDelete(row)}
                            color="inherit"
                        />
                    )
                }

                return actions
            },
        }

        columns.push(actionsColumn)
    }

    return columns
}

const generateSchemalessColumnDefs = (
    data: any[],
    enableActions: boolean,
    onEdit?: (row: any) => void,
    onDelete?: (row: any) => void,
    onView?: (row: any) => void
): GridColDef[] => {
    const columns: GridColDef[] = []

    if (!data || data.length === 0) {
        return [{
            field: 'id',
            headerName: 'ID',
            width: 100,
        }]
    }

    // Get all unique keys from the data
    const allKeys = new Set<string>()
    data.forEach(row => {
        if (row && typeof row === 'object') {
            Object.keys(row).forEach(key => allKeys.add(key))
        }
    })

    // Create columns for each key
    allKeys.forEach(key => {
        if (key === 'id') return // Skip id as it's handled by DataGrid

        const colDef: GridColDef = {
            field: key,
            headerName: key.charAt(0).toUpperCase() + key.slice(1),
            width: 150,
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
                const value = params.value

                // Handle objects with title property
                if (value && typeof value === 'object' && value.title) {
                    return <span>{value.title}</span>
                }

                // Handle arrays
                if (Array.isArray(value)) {
                    const displayValue = value.map(item =>
                        typeof item === 'object' && item.title ? item.title : String(item)
                    ).join(', ')

                    return (
                        <Tooltip title={displayValue}>
                            <Chip
                                label={`${value.length} items`}
                                size="small"
                                variant="outlined"
                            />
                        </Tooltip>
                    )
                }

                // Default: convert to string
                return <span>{value != null ? String(value) : ''}</span>
            }
        }

        columns.push(colDef)
    })

    // Add actions column if enabled
    if (enableActions && (onEdit || onDelete || onView)) {
        const actionsColumn: GridColDef = {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 120,
            cellClassName: 'actions',
            getActions: ({row}) => {
                const actions = []

                if (onView) {
                    actions.push(
                        <GridActionsCellItem
                            icon={<ViewIcon/>}
                            label="View"
                            onClick={() => onView(row)}
                            color="inherit"
                        />
                    )
                }

                if (onEdit) {
                    actions.push(
                        <GridActionsCellItem
                            icon={<EditIcon/>}
                            label="Edit"
                            onClick={() => onEdit(row)}
                            color="inherit"
                        />
                    )
                }

                if (onDelete) {
                    actions.push(
                        <GridActionsCellItem
                            icon={<DeleteIcon/>}
                            label="Delete"
                            onClick={() => onDelete(row)}
                            color="inherit"
                        />
                    )
                }

                return actions
            },
        }

        columns.push(actionsColumn)
    }

    return columns
}

const getDefaultWidth = (property: JsonSchemaProperty): number => {
    switch (property.type) {
        case 'boolean':
            return 80
        case 'number':
        case 'integer':
            return 120
        case 'string':
            if (property.format === 'date' || property.format === 'date-time') return 160
            if (property.maxLength && property.maxLength < 50) return 150
            return 200
        default:
            return 200
    }
}


const getColumnConfig = (property: JsonSchemaProperty): Partial<GridColDef> => {
    const config: Partial<GridColDef> = {}

    // Set cell renderer based on type/format
    switch (property.type) {
        case 'string':
            if (property.format === 'date' || property.format === 'date-time') {
                config.renderCell = DateCellRenderer
                config.type = 'date'
            } else if (property.enum) {
                config.renderCell = StatusCellRenderer
                config.type = 'singleSelect'
                config.valueOptions = property.enum
            } else {
                config.type = 'string'
            }
            break
        case 'object':
            config.renderCell = ReferenceCellRenderer
            config.sortable = false
            break
        case 'array':
            config.renderCell = ArrayCellRenderer
            config.sortable = false
            config.filterable = false
            break
        case 'boolean':
            config.renderCell = BooleanCellRenderer
            config.type = 'boolean'
            break
        case 'number':
        case 'integer':
            config.type = 'number'
            break
    }

    return config
}

// Custom loading overlay
const CustomLoadingOverlay = () => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 2,
        }}
    >
        <LinearProgress sx={{width: '50%'}}/>
        <Typography variant="body2" color="text.secondary">
            Loading data...
        </Typography>
    </Box>
)
const CustomNoRowsOverlay = () => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 1,
        }}
    >
        <Typography variant="h6" color="text.secondary">
            No data found
        </Typography>
        <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or add some data
        </Typography>
    </Box>
)


const AutoTable: React.FC<AutoTableProps> = ({
                                                 data,
                                                 schema,
                                                 config = {},
                                                 loading = false,
                                                 onRowClick,
                                                 onSelectionChange,
                                                 onDataChange,
                                                 onEdit,
                                                 onDelete,
                                                 onView,
                                                 className,
                                                 height = 600,
                                                 enableBulkActions = false,
                                                 enableActions = false,
                                                 showToolbar = true,
                                                 density = 'standard'
                                             }) => {
    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>()
    const [sortModel, setSortModel] = useState<GridSortModel>([])
    const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] })


    if (schema && !schema.properties && schema.allOf) schema.properties = schema.allOf[0]?.properties
    const columnDefs = useMemo(() => {
        if (!schema || !schema.properties) {
            return generateSchemalessColumnDefs(data, enableActions, onEdit, onDelete, onView)
        }
        return generateColumnDefs(schema.properties, enableActions, onEdit, onDelete, onView)
    }, [schema, data, enableActions, onEdit, onDelete, onView])


    const processedData = useMemo(() => {
        if (!data || !Array.isArray(data)) {
            return []
        }
        return data.map((row, index) => ({
            id: row?.id || `row-${index}`,
            ...row
        }))
    }, [data])

    // Custom slots for toolbar and overlays
    const slots = useMemo(() => {
        const slotsConfig: Partial<GridSlots> = {
            loadingOverlay: CustomLoadingOverlay,
            noRowsOverlay: CustomNoRowsOverlay,
        }

        // if (showToolbar) {
        //     slotsConfig.toolbar = GridToolbar
        // }

        return slotsConfig
    }, [showToolbar])

    const handleSelectionChangeWithData = useCallback((newSelection: GridRowSelectionModel) => {
        setSelectionModel(newSelection)
        if (onSelectionChange) {
            const selectedRows = processedData.filter(row =>
                newSelection.ids.add(row.id)
            )
            onSelectionChange(selectedRows)
        }
    }, [processedData, onSelectionChange])
    const handleRowClick = useCallback((params: GridRowParams) => {
        if (onRowClick && !enableBulkActions) {
            onRowClick(params.row)
        }
    }, [onRowClick, enableBulkActions])






    return (
        <DataGridErrorBoundary>
            <ThemeProvider theme={muiTheme}>
                <Box className={className} sx={{ height, width: '100%' }}>
                    <DataGrid
                        rows={processedData}
                        columns={columnDefs}
                        loading={loading}

                        // Selection
                        checkboxSelection={enableBulkActions}
                        rowSelectionModel={selectionModel}
                        onRowSelectionModelChange={handleSelectionChangeWithData}

                        // Interaction
                        onRowClick={handleRowClick}
                        disableRowSelectionOnClick={enableBulkActions}

                        // Sorting and filtering
                        sortModel={sortModel}
                        onSortModelChange={setSortModel}
                        filterModel={filterModel}
                        onFilterModelChange={setFilterModel}

                        // Pagination - ensure proper initialization
                        pagination={config.pagination !== false}
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

                        // Auto-size handling
                        autoHeight={false}

                        // Hide footer if no data to prevent state errors
                        hideFooter={processedData.length === 0 && loading}

                        // Styling
                        sx={{
                            '& .MuiDataGrid-cell:focus': {
                                outline: 'none',
                            },
                            '& .MuiDataGrid-row:hover': {
                                cursor: onRowClick ? 'pointer' : 'default',
                            },
                            // Ensure minimum height for empty states
                            minHeight: processedData.length === 0 ? 400 : 'auto',
                        }}
                    />
                </Box>
            </ThemeProvider>
        </DataGridErrorBoundary>
    )
}

export default AutoTable