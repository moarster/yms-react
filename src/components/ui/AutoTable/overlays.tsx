import { Box, LinearProgress, Typography } from '@mui/material'
import React from 'react'

export const LoadingOverlay: React.FC = () => (
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
        <LinearProgress sx={{ width: '50%' }} />
        <Typography variant="body2" color="text.secondary">
            Loading data...
        </Typography>
    </Box>
)

// Empty state overlay component
export const EmptyOverlay: React.FC = () => (
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
