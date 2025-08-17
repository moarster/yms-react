import { useMemo } from 'react';

import { DomainEntity } from '@/types';
import { SidebarSection } from '@/types/form.ts';

interface SidebarFieldConfig {
  icon?: React.ComponentType<{ className?: string }>;
  key: string;
  label: string;
  type?: 'date' | 'status' | 'text' | 'user';
}

interface SidebarSectionConfig {
  condition?: (document: DomainEntity) => boolean;
  fields: SidebarFieldConfig[];
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
}

interface UseDocumentSidebarProps {
  document: DomainEntity;
  sectionConfigs: SidebarSectionConfig[];
}

export const useDocumentSidebar = ({ document, sectionConfigs }: UseDocumentSidebarProps) => {
  const sidebarSections: SidebarSection[] = useMemo(() => {
    if (!document) return [];

    return sectionConfigs
      .filter((config) => !config.condition || config.condition(document))
      .map((config) => ({
        icon: config.icon,
        items: config.fields
          .filter((field) => {
            const value = getNestedValue(document, field.key);
            return value !== null && value !== undefined && value !== '';
          })
          .map((field) => ({
            label: field.label,
            type: field.type,
            value: formatFieldValue(getNestedValue(document, field.key), field.type),
          })),
        title: config.title,
      }))
      .filter((section) => section.items && section.items.length > 0);
  }, [document, sectionConfigs]);

  return { sidebarSections };
};

// Helper functions
function getNestedValue(obj: object, path: string): object {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function formatFieldValue(value: string, type?: string): string {
  if (value === null || value === undefined) return '';

  switch (type) {
    case 'date':
      return new Date(value).toLocaleDateString();
    // case 'user':
    //     return typeof value === 'object' ? (value.name || value.email) : value
    default:
      return String(value);
  }
}
