import { useMemo } from 'react';

import { FormConfig, JsonSchema } from '@/types';

export const useShipmentRfpForm = (
  schema: JsonSchema,
  formData: object,
  onFormChange: (data: object) => void,
  onFormSubmit: (data: object) => void,
) => {
  const formConfig = useMemo(() => {
    if (!schema) return null;
    return {
      formData,
      schema,
      uiSchema: {
        cargoDetails: { 'ui:layout': 'accordion', 'ui:title': 'Cargo Details' },
        deliveryLocation: { 'ui:layout': 'accordion', 'ui:title': 'Delivery Location' },
        description: { 'ui:options': { rows: 4 }, 'ui:widget': 'textarea' },
        pickupLocation: { 'ui:layout': 'accordion', 'ui:title': 'Pickup Location' },
        title: { 'ui:options': { className: 'text-xl font-semibold' }, 'ui:widget': 'text' },
      },
    } as FormConfig;
  }, [schema, formData]);

  return {
    formConfig,
    onFormChange,
    onFormSubmit,
  };
};
