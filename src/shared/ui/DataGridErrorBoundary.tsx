import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { Alert,Box, Button, Typography } from '@mui/material'
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
    errorInfo?: ErrorInfo
}

class DataGridErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('DataGrid Error Boundary caught an error:', error, errorInfo)
        this.setState({ errorInfo })
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 400,
                        p: 3,
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        backgroundColor: '#f8fafc',
                    }}
                >
                    <Alert severity="error" sx={{ mb: 2, maxWidth: 600 }}>
                        <Typography variant="h6" gutterBottom>
                            Table Error
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            There was an error loading the table. This usually happens when the data structure doesn't match the expected format.
                        </Typography>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <Typography variant="caption" component="pre" sx={{
                                mt: 1,
                                fontSize: '11px',
                                backgroundColor: '#f5f5f5',
                                p: 1,
                                borderRadius: 1,
                                overflow: 'auto',
                                maxHeight: 100
                            }}>
                                {this.state.error.message}
                            </Typography>
                        )}
                    </Alert>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowPathIcon style={{ width: 16, height: 16 }} />}
                        onClick={this.handleRetry}
                    >
                        Try Again
                    </Button>
                </Box>
            )
        }

        return this.props.children
    }
}

export default DataGridErrorBoundary