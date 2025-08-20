import { Checkbox, NumberInput, Select, Switch, Textarea, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import React, { useEffect, useRef } from 'react';
import { RenderEditCellProps } from 'react-data-grid';

import { TableRow } from '@/shared/ui/DataGridTable/types';

function useEditor<T>(
  value: T,
  onChange: (value: T) => void,
  onCommit: () => void,
  onCancel: () => void,
) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onCommit();
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return { handleKeyDown };
}

// Text editor
export function TextEditor({ column, onClose, onRowChange, row }: RenderEditCellProps<TableRow>) {
  const value = String(row[column.key] ?? '');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  const handleChange = (newValue: string) => {
    onRowChange({ ...row, [column.key]: newValue }, false);
  };

  const { handleKeyDown } = useEditor(
    value,
    handleChange,
    () => onClose(true),
    () => onClose(false),
  );

  return (
    <TextInput
      styles={{
        input: {
          height: '100%',
          minHeight: 'auto',
          padding: '0 8px',
        },
        wrapper: {
          height: '100%',
        },
      }}
      ref={ref}
      size="xs"
      value={value}
      variant="unstyled"
      onKeyDown={handleKeyDown}
      onBlur={() => onClose(true)}
      onChange={(e) => handleChange(e.currentTarget.value)}
    />
  );
}

// Number editor
export function NumberEditor({ column, onClose, onRowChange, row }: RenderEditCellProps<TableRow>) {
  const value = Number(row[column.key] ?? 0);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  const handleChange = (newValue: number | string) => {
    const num = typeof newValue === 'string' ? parseFloat(newValue) || 0 : newValue;
    onRowChange({ ...row, [column.key]: num }, false);
  };

  const { handleKeyDown } = useEditor(
    value,
    handleChange,
    () => onClose(true),
    () => onClose(false),
  );

  return (
    <NumberInput
      styles={{
        input: {
          height: '100%',
          minHeight: 'auto',
          padding: '0 8px',
        },
        wrapper: {
          height: '100%',
        },
      }}
      ref={ref}
      size="xs"
      value={value}
      variant="unstyled"
      hideControls
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={() => onClose(true)}
    />
  );
}

// Boolean editor with checkbox
export function BooleanEditor({
  column,
  onClose,
  onRowChange,
  row,
}: RenderEditCellProps<TableRow>) {
  const value = Boolean(row[column.key] ?? false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const handleChange = (checked: boolean) => {
    onRowChange({ ...row, [column.key]: checked }, true);
    onClose(true);
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Checkbox
        ref={ref}
        size="sm"
        checked={value}
        onChange={(e) => handleChange(e.currentTarget.checked)}
      />
    </div>
  );
}

// Boolean editor with switch
export function SwitchEditor({ column, onClose, onRowChange, row }: RenderEditCellProps<TableRow>) {
  const value = Boolean(row[column.key] ?? false);

  const handleChange = (checked: boolean) => {
    onRowChange({ ...row, [column.key]: checked }, true);
    onClose(true);
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Switch size="sm" checked={value} onChange={(e) => handleChange(e.currentTarget.checked)} />
    </div>
  );
}

// Select editor
interface SelectEditorProps extends RenderEditCellProps<TableRow> {
  options: Array<{ value: number | string; label: string }> | number[] | string[];
}

export function SelectEditor({ column, onClose, onRowChange, options, row }: SelectEditorProps) {
  const value = String(row[column.key] ?? '');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const selectOptions = Array.isArray(options)
    ? options.map((opt) =>
        typeof opt === 'object'
          ? { label: opt.label, value: String(opt.value) }
          : { label: String(opt), value: String(opt) },
      )
    : [];

  const handleChange = (newValue: null | string) => {
    if (newValue !== null) {
      onRowChange({ ...row, [column.key]: newValue }, true);
      onClose(true);
    }
  };

  return (
    <Select
      styles={{
        input: {
          height: '100%',
          minHeight: 'auto',
          padding: '0 8px',
        },
        wrapper: {
          height: '100%',
        },
      }}
      ref={ref}
      size="xs"
      value={value}
      variant="unstyled"
      data={selectOptions}
      clearable
      searchable
      onChange={handleChange}
    />
  );
}

// Date editor
export function DateEditor({ column, onClose, onRowChange, row }: RenderEditCellProps<TableRow>) {
  const value = row[column.key];
  const dateValue = value ? new Date(value as number | string) : null;

  const handleChange = (date: Date | null) => {
    onRowChange({ ...row, [column.key]: date?.toISOString() || null }, true);
    onClose(true);
  };

  return (
    <DateInput
      styles={{
        input: {
          height: '100%',
          minHeight: 'auto',
          padding: '0 8px',
        },
        wrapper: {
          height: '100%',
        },
      }}
      size="xs"
      value={dateValue}
      variant="unstyled"
      popoverProps={{ withinPortal: true }}
      onChange={handleChange}
    />
  );
}

// Textarea editor for long text
export function TextareaEditor({
  column,
  onClose,
  onRowChange,
  row,
}: RenderEditCellProps<TableRow>) {
  const value = String(row[column.key] ?? '');
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  const handleChange = (newValue: string) => {
    onRowChange({ ...row, [column.key]: newValue }, false);
  };

  const { handleKeyDown } = useEditor(
    value,
    handleChange,
    () => onClose(true),
    () => onClose(false),
  );

  return (
    <Textarea
      styles={{
        input: {
          minHeight: 'auto',
          padding: '4px 8px',
        },
        wrapper: {
          height: '100%',
        },
      }}
      ref={ref}
      size="xs"
      maxRows={4}
      minRows={1}
      value={value}
      variant="unstyled"
      autosize
      onKeyDown={handleKeyDown}
      onBlur={() => onClose(true)}
      onChange={(e) => handleChange(e.currentTarget.value)}
    />
  );
}
