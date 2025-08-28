import { useMemo } from 'react';

import { validateINN, validateRoutePoint } from '@/features/documents/types/shipment-rfp.ts';
import { WizardFormData } from '@/features/documents/components/wizard.types.ts';

export const useWizardValidation = (formData: WizardFormData) => {
  const stepValidation = useMemo(() => {
    const validateBasicInfo = () => {
      const errors: string[] = [];
      if (!formData._shipmentType?.id) errors.push('Вид транспортировки обязателен');
      if (!formData._transportationType?.id) errors.push('Вид отгрузки обязателен');
      if (!formData._currency?.id) errors.push('Валюта обязательна');
      return errors;
    };

    const validateRoute = () => {
      const errors: string[] = [];
      if (!formData.route?.length) {
        errors.push('Добавьте хотя бы одну точку маршрута');
        return errors;
      }

      formData.route.forEach((point, index) => {
        const pointErrors = validateRoutePoint(point);
        pointErrors.forEach((error) => errors.push(`Точка ${index + 1}: ${error}`));

        // Additional cargo validation
        if (!point.cargoList?.length) {
          errors.push(`Точка ${index + 1}: Добавьте хотя бы один груз`);
        } else {
          point.cargoList.forEach((cargo, cargoIndex) => {
            if (!cargo.number?.trim()) {
              errors.push(`Точка ${index + 1}, груз ${cargoIndex + 1}: Номер груза обязателен`);
            }
            if (!cargo._cargoNature?.id) {
              errors.push(`Точка ${index + 1}, груз ${cargoIndex + 1}: Характер груза обязателен`);
            }
            if (cargo.cargoWeight < 0) {
              errors.push(
                `Точка ${index + 1}, груз ${cargoIndex + 1}: Вес не может быть отрицательным`,
              );
            }
            if (cargo.cargoVolume < 0) {
              errors.push(
                `Точка ${index + 1}, груз ${cargoIndex + 1}: Объем не может быть отрицательным`,
              );
            }
          });
        }
      });
      return errors;
    };

    const validateTransport = () => {
      const errors: string[] = [];
      if (!formData._requiredVehicleType?.id) {
        errors.push('Выберите требуемый тип транспортного средства');
      }
      if (formData.customRequirements && formData.customRequirements.length > 1000) {
        errors.push('Особые требования не должны превышать 1000 символов');
      }
      return errors;
    };

    const validateAdditional = () => {
      const errors: string[] = [];
      if (formData.comment && formData.comment.length > 1000) {
        errors.push('Комментарий не должен превышать 1000 символов');
      }

      if (formData.actualCarrier?.taxIdentificationNumber) {
        if (!validateINN(formData.actualCarrier.taxIdentificationNumber)) {
          errors.push('Некорректный ИНН (должен содержать 10 или 12 цифр)');
        }
      }

      return errors;
    };

    return {
      additional: validateAdditional(),
      basic: validateBasicInfo(),
      route: validateRoute(),
      transport: validateTransport(),
    };
  }, [formData]);

  const isStepValid = (stepId: string): boolean => {
    switch (stepId) {
      case 'basic':
        return stepValidation.basic.length === 0;
      case 'route':
        return stepValidation.route.length === 0;
      case 'transport':
        return stepValidation.transport.length === 0;
      case 'additional':
        return stepValidation.additional.length === 0;
      default:
        return true;
    }
  };

  const getStepErrors = (stepId: string): string[] => {
    switch (stepId) {
      case 'basic':
        return stepValidation.basic;
      case 'route':
        return stepValidation.route;
      case 'transport':
        return stepValidation.transport;
      case 'additional':
        return stepValidation.additional;
      default:
        return [];
    }
  };

  const canProceedToNext = (currentStepId: string): boolean => {
    return isStepValid(currentStepId);
  };

  const canSubmit = (): boolean => {
    return (
      isStepValid('basic') &&
      isStepValid('route') &&
      isStepValid('transport') &&
      isStepValid('additional')
    );
  };

  const getAllErrors = (): string[] => {
    return [
      ...stepValidation.basic,
      ...stepValidation.route,
      ...stepValidation.transport,
      ...stepValidation.additional,
    ];
  };

  return {
    canProceedToNext,
    canSubmit,
    getAllErrors,
    getStepErrors,
    isStepValid,
    stepValidation,
  };
};
