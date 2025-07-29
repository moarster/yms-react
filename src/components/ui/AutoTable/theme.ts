import { createTheme } from '@mui/material'

export const autoTableTheme = createTheme({
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
        MuiTable: {
            styleOverrides: {
                root: {
                    border: '1px solid #e2e8f0', // slate-200
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    '& .MuiTable-cell': {
                        borderColor: '#f1f5f9', // slate-100
                        fontSize: '14px',
                        color: '#374151', // gray-700
                    },
                    '& .MuiTable-columnHeaders': {
                        backgroundColor: '#f8fafc', // slate-50
                        borderBottom: '2px solid #e2e8f0',
                        '& .MuiTable-columnHeader': {
                            fontWeight: 600,
                            fontSize: '14px',
                            color: '#374151', // gray-700
                        },
                    },
                    '& .MuiTable-row': {
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
                    '& .MuiTable-footerContainer': {
                        borderTop: '1px solid #e2e8f0',
                        backgroundColor: '#f8fafc',
                    },
                },
            },
        },
    },
})

export const tableStyles = {
    container: {
        width: '100%',
        height: '100%',
    },
    dataGrid: {
        '& .MuiDataGrid-cell:focus': {
            outline: 'none',
        },
        '& .MuiDataGrid-row:hover': {
            cursor: (hasRowClick: boolean) => hasRowClick ? 'pointer' : 'default',
        },
        // Ensure minimum height for empty states
        minHeight: (isEmpty: boolean) => isEmpty ? 400 : 'auto',
    }
} as const