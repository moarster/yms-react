import { Column, RenderCellProps, RenderEditCellProps } from 'react-data-grid';

import { TableRow } from '@/shared/ui/DataGridTable/types.ts';
import { JsonSchema, JsonSchemaProperty } from '@/types';

import { cellEditors } from './render/cellEditorRegistry.ts';
import { cellRenderers } from './render/cellRenderers.tsx';

export function generateDataGridColumns<T extends TableRow>(
  schema: JsonSchema | undefined,
  enableInlineEdit: boolean,
  selectable?: boolean,
): Column<T>[] {
  const columns: Column<T>[] = [];

  if (selectable) {
    columns.push({
      frozen: true,
      key: 'selection',
      maxWidth: 0,
      minWidth: 0,
      name: '',
      renderCell: (props: RenderCellProps<T>) => {
        const rowId = props.row.id || '';
        const isSelected = props.isRowSelected || false;

        return (
          <div className="selection-cell-container">
            <button
              title={isSelected ? 'Deselect row' : 'Select row'}
              className={`selection-circle ${isSelected ? 'selected' : 'unselected'}`}
              onClick={(e) => {
                e.stopPropagation();
                if (props.onRowSelectionChange) {
                  props.onRowSelectionChange({
                    checked: !isSelected,
                    isShiftClick: e.shiftKey,
                    row: props.row,
                  });
                }
              }}
            />
          </div>
        );
      },
      renderHeaderCell: () => <div className="w-0 h-0 overflow-hidden" />,
      resizable: false,
      sortable: false,
      width: 0,
    });
  }

  if (schema?.properties) {
    // Schema-based columns
    Object.entries(schema.properties).forEach(([key, property]: [string, JsonSchemaProperty]) => {
      if (property['x-table-hidden']) return;
      if (property.type === 'object' && !key.startsWith('_')) return;

      const column: Column<T> = {
        editable: enableInlineEdit && !property['x-table-readonly'],
        key,
        name: property.title || key,
        renderCell: getCellRenderer(key, property),
        renderEditCell: getCellEditor(property),
        resizable: true,
        sortable: property['x-table-sortable'] !== false,
        width: property['x-table-width'] || getDefaultWidth(property),
      };

      columns.push(column);
    });
  } else {
    // Schemaless columns - generate from data
    const sampleRow = (schema as any)?.[0];
    if (sampleRow && typeof sampleRow === 'object') {
      Object.keys(sampleRow).forEach((key) => {
        if (key === 'id') return;

        columns.push({
          editable: enableInlineEdit,
          key,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          renderCell: (props: RenderCellProps<T>) => {
            const value = props.row[key as keyof T];
            return cellRenderers.auto(value);
          },
          resizable: true,
          sortable: true,
          width: 150,
        });
      });
    }
  }

  return columns;
}

function getDefaultWidth(property: JsonSchemaProperty): number {
  switch (property.type) {
    case 'boolean':
      return 80;
    case 'number':
    case 'integer':
      return 120;
    case 'string':
      if (property.format === 'date' || property.format === 'date-time') return 160;
      if (property.enum) return 140;
      if (property.maxLength && property.maxLength < 50) return 150;
      return 200;
    case 'array':
      return 150;
    case 'object':
      return 200;
    default:
      return 150;
  }
}

function getCellRenderer(key: string, property: JsonSchemaProperty) {
  return (props: RenderCellProps<any>) => {
    const value = props.row[key];

    // Handle special cases
    if (key === 'status' || key.toLowerCase().includes('status')) {
      return cellRenderers.status(value);
    }

    // Type-based rendering
    switch (property.type) {
      case 'boolean':
        return cellRenderers.boolean(value);
      case 'string':
        if (property.format === 'date' || property.format === 'date-time') {
          return cellRenderers.date(value);
        }
        if (property.enum) {
          return cellRenderers.status(value);
        }
        return cellRenderers.text(value);
      case 'number':
      case 'integer':
        return cellRenderers.number(value);
      case 'array':
        return cellRenderers.array(value);
      case 'object':
        return cellRenderers.reference(value);
      default:
        return cellRenderers.text(value);
    }
  };
}

function getCellEditor<T extends TableRow>(property: JsonSchemaProperty) {
  return (props: RenderEditCellProps<T>) => {
    switch (property.type) {
      case 'boolean':
        return cellEditors.boolean(props);
      case 'string':
        if (property.enum) {
          return cellEditors.select(props, property.enum);
        }
        if (property.format === 'date') {
          return cellEditors.date(props);
        }
        return cellEditors.text(props);
      case 'number':
      case 'integer':
        return cellEditors.number(props);
      default:
        return cellEditors.text(props);
    }
  };
}
