import { Chip, Tooltip } from '@mantine/core';
import { format } from 'date-fns';
import React from 'react';

import { BaseEntity } from '@/types';

import { CellRendererProps } from '../../DataGridTable/types.ts';

export const StatusCellRenderer: React.FC<CellRendererProps<string>> = ({ value }) => {
  if (!value) return null;

  const statusColors = {
    ASSIGNED: { bg: '#dbeafe', text: '#1d4ed8' },
    CANCELLED: { bg: '#fee2e2', text: '#dc2626' },
    CLOSED: { bg: '#dcfce7', text: '#166534' },
    NEW: { bg: '#f3f4f6', text: '#374151' },
  } as const;

  const colors = statusColors[value as keyof typeof statusColors] || statusColors.NEW;

  return (
    <Chip
      sx={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontSize: '12px',
        fontWeight: 500,
        height: '24px',
      }}
      size="small"
      label={value}
    />
  );
};

// Date renderer with proper typing
export const DateCellRenderer: React.FC<CellRendererProps<Date | string>> = ({ value }) => {
  if (!value) return null;

  try {
    const date = typeof value === 'string' ? new Date(value) : value;
    return <span>{format(date, 'dd.MM.yyyy HH:mm')}</span>;
  } catch {
    return <span>{String(value)}</span>;
  }
};

// Reference/entity renderer with proper typing
export const ReferenceCellRenderer: React.FC<
  CellRendererProps<BaseEntity | { title?: string }>
> = ({ value }) => {
  if (!value) return null;

  if (typeof value === 'object' && 'title' in value) {
    return <span>{value.title || ''}</span>;
  }

  return <span>{String(value)}</span>;
};

// Array renderer with proper typing
export const ArrayCellRenderer: React.FC<CellRendererProps<unknown[]>> = ({ value }) => {
  if (!Array.isArray(value) || value.length === 0) return null;

  if (value.length === 1) {
    const item = value[0];
    const displayValue =
      typeof item === 'object' && item && 'title' in item
        ? (item as { title: string }).title
        : String(item);
    return <span>{displayValue}</span>;
  }

  const displayValue = value
    .map((item) =>
      typeof item === 'object' && item && 'title' in item
        ? (item as { title: string }).title
        : String(item),
    )
    .join(', ');

  return (
    <Tooltip title={displayValue}>
      <Chip size="small" variant="outlined" label={`${value.length} items`} />
    </Tooltip>
  );
};

export const BooleanCellRenderer: React.FC<CellRendererProps<boolean>> = ({ value }) => (
  <Chip
    size="small"
    variant="outlined"
    label={value ? '✓' : '✗'}
    color={value ? 'success' : 'default'}
  />
);

export const TextCellRenderer: React.FC<CellRendererProps<unknown>> = ({ value }) => (
  <span>{value != null ? String(value) : ''}</span>
);
