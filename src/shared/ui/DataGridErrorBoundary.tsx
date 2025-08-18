import { Alert, Box, Button, Typography } from '@mantine/core';
import { ArrowClockwiseIcon } from '@phosphor-icons/react';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error?: Error;
  errorInfo?: ErrorInfo;
  hasError: boolean;
}

class DataGridErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error, hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('DataGrid Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ error: undefined, errorInfo: undefined, hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: 400,
            p: 3,
          }}
        >
          <Alert severity="error" sx={{ maxWidth: 600, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Table Error
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              There was an error loading the table. This usually happens when the data structure
              doesn't match the expected format.
            </Typography>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Typography
                sx={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  fontSize: '11px',
                  maxHeight: 100,
                  mt: 1,
                  overflow: 'auto',
                  p: 1,
                }}
                component="pre"
                variant="caption"
              >
                {this.state.error.message}
              </Typography>
            )}
          </Alert>

          <Button
            variant="outlined"
            startIcon={<ArrowClockwiseIcon style={{ height: 16, width: 16 }} />}
            onClick={this.handleRetry}
          >
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default DataGridErrorBoundary;
