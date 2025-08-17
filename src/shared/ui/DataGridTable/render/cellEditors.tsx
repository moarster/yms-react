import React, { useEffect, useRef } from 'react';
import { RenderEditCellProps } from 'react-data-grid';

export const TextEditor: React.FC<RenderEditCellProps<any>> = (props) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  return (
    <input
      ref={ref}
      value={props.row[props.column.key] || ''}
      className="w-full h-full px-2 py-1 border-0 outline-none focus:ring-2 focus:ring-blue-500"
      onBlur={() => props.onClose(true)}
      onChange={(e) => props.onRowChange({ ...props.row, [props.column.key]: e.target.value })}
    />
  );
};

export const NumberEditor: React.FC<RenderEditCellProps<any>> = (props) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  return (
    <input
      ref={ref}
      type="number"
      value={props.row[props.column.key] || 0}
      className="w-full h-full px-2 py-1 border-0 outline-none focus:ring-2 focus:ring-blue-500"
      onBlur={() => props.onClose(true)}
      onChange={(e) =>
        props.onRowChange({ ...props.row, [props.column.key]: Number(e.target.value) })
      }
    />
  );
};

export const BooleanEditor: React.FC<RenderEditCellProps<any>> = (props) => {
  return (
    <div className="flex items-center justify-center h-full">
      <input
        type="checkbox"
        checked={props.row[props.column.key] || false}
        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        autoFocus
        onChange={(e) => {
          props.onRowChange({ ...props.row, [props.column.key]: e.target.checked });
          props.onClose(true);
        }}
      />
    </div>
  );
};

interface SelectEditorProps extends RenderEditCellProps<any> {
  options: any[];
}

export const SelectEditor: React.FC<SelectEditorProps> = ({ options, ...props }) => {
  const ref = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <select
      ref={ref}
      value={props.row[props.column.key] || ''}
      className="w-full h-full px-2 py-1 border-0 outline-none focus:ring-2 focus:ring-blue-500"
      onBlur={() => props.onClose(false)}
      onChange={(e) => {
        props.onRowChange({ ...props.row, [props.column.key]: e.target.value });
        props.onClose(true);
      }}
    >
      <option value="">Select...</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
};

export const DateEditor: React.FC<RenderEditCellProps<any>> = (props) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <input
      ref={ref}
      type="date"
      value={props.row[props.column.key] || ''}
      className="w-full h-full px-2 py-1 border-0 outline-none focus:ring-2 focus:ring-blue-500"
      onBlur={() => props.onClose(true)}
      onChange={(e) => props.onRowChange({ ...props.row, [props.column.key]: e.target.value })}
    />
  );
};
