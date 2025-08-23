// noinspection D

import { Textarea } from '@mantine/core';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ExclamationMarkIcon,
  FileTextIcon,
  MapPinIcon,
  PackageIcon,
  TruckIcon,
} from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';

import { useWizardValidation } from '@/features/documents/hooks/useWizardValidation.ts';
import {
  Cargo,
  createCargo,
  createRoutePoint,
  RoutePoint,
} from '@/features/documents/types/shipment-rfp.ts';
import {
  ShipmentRfpWizardProps,
  WizardFormData,
} from '@/features/documents/wizards/wizard.types.ts';
import { ChipInput, DateInput, NumberInput, ReferenceInput, TextInput } from '@/shared/form/inputs';
import FileUpload from '@/shared/form/inputs/FileUpload.tsx';
import { isBaseEntity } from '@/types';
import { LinkFactories } from '@/types/factories/linkFactory.ts';
import { useSchema } from '@/hooks/useSchema.ts';

const ShipmentRfpWizard: React.FC<ShipmentRfpWizardProps> = ({
  initialData,
  isSubmitting = false,
  onCancel,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<WizardFormData>(initialData);
  const { canProceedToNext, canSubmit, getStepErrors } = useWizardValidation(formData);
  const {
    getLinkDefinition,
    isLoading: schemaLoading,
  } = useSchema({
    entityKey: 'shipment-rfp'
  });

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);
  if (schemaLoading) {
    return <div>Loading schema...</div>;
  }
  const steps = [
    {
      description: 'Тип перевозки и базовые параметры',
      icon: FileTextIcon,
      id: 'basic',
      title: 'Основная информация',
    },
    {
      description: 'Точки загрузки/выгрузки и описание груза',
      icon: MapPinIcon,
      id: 'route',
      title: 'Маршрут и груз',
    },
    {
      description: 'Тип транспорта и особые требования',
      icon: TruckIcon,
      id: 'transport',
      title: 'Требования к ТС',
    },
    {
      description: 'Комментарии и завершение',
      icon: PackageIcon,
      id: 'additional',
      title: 'Дополнительно',
    },
  ];

  const updateFormData = (field: keyof WizardFormData, value: unknown) => {
    setFormData((prev) => {
      if (typeof field === 'string' && field.startsWith('_')) {
        const existingValue = prev[field];

        if (
          typeof existingValue === 'object' &&
          existingValue !== null &&
          'id' in existingValue &&
          isBaseEntity(value)
        ) {
          return {
            ...prev,
            [field]: {
              ...existingValue,
              entry: value,
              id: value.id,
              title: value.title,
            },
          };
        }
      }

      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const updateRouteData = (index: number, field: keyof RoutePoint, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      route:
        prev.route?.map((point, i) => {
          if (i !== index) return point;

          if (typeof field === 'string' && field.startsWith('_')) {
            const existingValue = point[field];

            // Handle reference field updates
            if (
              typeof existingValue === 'object' &&
              existingValue !== null &&
              'id' in existingValue &&
              isBaseEntity(value)
            ) {
              if (isBaseEntity(value))
                return {
                  ...point,
                  [field]: {
                    ...existingValue,
                    entry: value,
                    id: value.id,
                    title: value.title,
                  },
                };
              else
                return {
                  ...point,
                  [field]: {
                    ...existingValue,
                    id: value,
                  },
                };
            }
          }

          return { ...point, [field]: value };
        }) || [],
    }));
  };

  const updateCargoData = (
    routeIndex: number,
    cargoIndex: number,
    field: keyof Cargo,
    value: unknown,
  ) => {
    setFormData((prev) => ({
      ...prev,
      route:
        prev.route?.map((point, i) => {
          if (i !== routeIndex) return point;

          return {
            ...point,
            cargoList:
              point.cargoList?.map((cargo, j) => {
                if (j !== cargoIndex) return cargo;

                if (field.startsWith('_')) {
                  const existingValue = cargo[field];

                  // Handle reference field updates for cargo
                  if (
                    typeof existingValue === 'object' &&
                    existingValue !== null &&
                    'id' in existingValue
                  ) {
                    if (isBaseEntity(value))
                      return {
                        ...cargo,
                        [field]: {
                          ...existingValue,
                          entry: value,
                          id: value.id,
                          title: value.title,
                        },
                      };
                    else
                      return {
                        ...cargo,
                        [field]: {
                          ...existingValue,
                          id: value,
                        },
                      };
                  }
                }

                return { ...cargo, [field]: value };
              }) || [],
          };
        }) || [],
    }));
  };

  const addRoutePoint = () => {
    setFormData((prev) => ({
      ...prev,
      route: [...(prev.route || []), createRoutePoint()],
    }));
  };

  const addCargoItem = (routeIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      route:
        prev.route?.map((point, i) =>
          i === routeIndex
            ? {
                ...point,
                cargoList: [...(point.cargoList || []), createCargo()],
              }
            : point,
        ) || [],
    }));
  };
  const removeCargoItem = (routeIndex: number, cargoIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      route:
        prev.route?.map((point, i) =>
          i === routeIndex
            ? {
                ...point,
                cargoList: point.cargoList?.filter((_, j) => j !== cargoIndex) || [],
              }
            : point,
        ) || [],
    }));
  };
  const canProceed = () => {
    return canProceedToNext(steps[currentStep].id);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (canSubmit()) {
      onSubmit(formData);
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <ReferenceInput
          placeholder="Выберите"
          label="Вид транспортировки"
          emptyFactory={LinkFactories.shipmentType}
          value={formData._shipmentType || LinkFactories.shipmentType()}
          linkDef={getLinkDefinition('_shipmentType')}
          required
          onChange={(value) => updateFormData('_shipmentType', value)}
        />
        <ReferenceInput
          label="Вид отгрузки"
          placeholder="Выберите"
          linkDef={getLinkDefinition('_transportationType')}
          emptyFactory={LinkFactories.transportationType}
          value={formData._transportationType || LinkFactories.transportationType()}
          required
          onChange={(value) => updateFormData('_transportationType', value)}
        />
        <ReferenceInput
          label="Валюта"
          placeholder="Выберите"
          linkDef={getLinkDefinition('_currency')}
          emptyFactory={LinkFactories.currency}
          value={formData._currency || LinkFactories.currency()}
          required
          onChange={(value) => updateFormData('_currency', value)}
        />
        <ChipInput
          className="align-middle"
          label="Экспресс отгрузка"
          value={formData.express || false}
          onChange={(value) => updateFormData('express', value)}
        />
      </div>
    </div>
  );

  const renderRoute = () => (
    <div className="space-y-6">
      {formData.route?.map((point, routeIndex) => (
        <div key={routeIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2 text-blue-500" />
              Точка {routeIndex + 1}
            </h3>
            {(formData?.route?.length ?? 0) > 1 && (
              <button
                className="text-red-600 hover:text-red-800 text-sm"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    route: prev?.route?.filter((_, i) => i !== routeIndex),
                  }));
                }}
              >
                Удалить
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <TextInput
              type="text"
              label="Адрес"
              value={point.address}
              className="md:col-span-2"
              placeholder="Введите адрес"
              required
              onChange={(value) => updateRouteData(routeIndex, 'address', value)}
            />
            <ReferenceInput
              label="Контрагент"
              placeholder="Выберите"
              linkDef={getLinkDefinition('/route/_counterParty')}
              emptyFactory={LinkFactories.counterParty}
              value={point._counterParty || LinkFactories.counterParty()}
              required
              onChange={(value) => updateRouteData(routeIndex, '_counterParty', value)}
            />
            <ReferenceInput
              placeholder="Выберите"
              label="Тип обработки груза"
              linkDef={getLinkDefinition('/route/_cargoHandlingType')}
              emptyFactory={LinkFactories.cargoHandlingType}
              value={point._cargoHandlingType || LinkFactories.cargoHandlingType()}
              required
              onChange={(value) => updateRouteData(routeIndex, '_cargoHandlingType', value)}
            />

            <TextInput
              type="tel"
              label="Телефон"
              placeholder="+7 (900) 000-00-00"
              value={point.contactPhone || ''}
              onChange={(value) => updateRouteData(routeIndex, 'contactPhone', value)}
            />
            <DateInput
              type="default"
              value={point.arrival}
              label="Плановое время прибытия"
              onChange={(value) => updateRouteData(routeIndex, 'arrival', value)}
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-medium text-gray-900 flex items-center">
                <PackageIcon className="h-4 w-4 mr-2 text-green-500" />
                Грузы
              </h4>
              <button
                className="text-blue-600 hover:text-blue-800 text-sm"
                onClick={() => addCargoItem(routeIndex)}
              >
                + Добавить груз
              </button>
            </div>

            {point.cargoList.map((cargo, cargoIndex) => (
              <div
                key={cargoIndex}
                className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 p-3 bg-white rounded border"
              >
                <TextInput
                  type="text"
                  value={cargo.number}
                  label="Номер груза *"
                  onChange={(value) =>
                    updateCargoData(routeIndex, cargoIndex, 'number', value || '')
                  }
                />
                <NumberInput
                  min={0}
                  step={0.01}
                  label="Вес (кг)"
                  className="text-sm"
                  value={cargo.cargoWeight}
                  onChange={(value) =>
                    updateCargoData(routeIndex, cargoIndex, 'cargoWeight', value || 0)
                  }
                />
                <NumberInput
                  min={0}
                  step={0.01}
                  label="Объем (м³)"
                  className="text-sm"
                  value={cargo.cargoVolume}
                  onChange={(value) =>
                    updateCargoData(routeIndex, cargoIndex, 'cargoVolume', value || 0)
                  }
                />

                <ReferenceInput
                  label="Характер груза"
                  placeholder="Выберите"
                  linkDef={getLinkDefinition('/route/cargoList/_cargoNature')}
                  emptyFactory={LinkFactories.cargoNature}
                  value={cargo._cargoNature || LinkFactories.cargoNature()}
                  required
                  onChange={(value) =>
                    updateCargoData(routeIndex, cargoIndex, '_cargoNature', value)
                  }
                />

                <div className="flex items-end justify-center">
                  {point.cargoList.length > 1 && (
                    <button
                      title="Remove this cargo item"
                      className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border border-red-300 rounded hover:bg-red-50"
                      onClick={() => removeCargoItem(routeIndex, cargoIndex)}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
        onClick={addRoutePoint}
      >
        + Добавить точку маршрута
      </button>
    </div>
  );

  const renderTransport = () => (
    <div className="space-y-6">
      <ReferenceInput
        label="Требуемый тип"
        placeholder="Выберите"
        linkDef={getLinkDefinition('_requiredVehicleType')}
        emptyFactory={LinkFactories.vehicleType}
        value={formData._requiredVehicleType || LinkFactories.vehicleType()}
        required
        onChange={(value) => updateFormData('_requiredVehicleType', value)}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Особые требования</label>
        <textarea
          rows={4}
          maxLength={1000}
          value={formData.customRequirements}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Водитель Исполнителя обязан в соответствии с п. 5.16. договора проверить надлежащую расстановку груза с целью исключения превышения максимально допустимой нагрузки на ось и с учетом допустимой массы ТС, в том числе указанных в специальном разрешении."
          onChange={(e) => updateFormData('customRequirements', e.target.value)}
        />
        <div className="text-sm text-gray-500 mt-1">
          ${formData.customRequirements?.length ?? 0}/1000 символов
        </div>
      </div>
    </div>
  );

  const renderAdditional = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Комментарий</label>
        <Textarea
          rows={3}
          maxLength={1000}
          value={formData.comment || ''}
          placeholder="Дополнительные комментарии к заявке"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onChange={(e) => updateFormData('comment', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Внутренний комментарий
        </label>
        <Textarea
          rows={3}
          value={formData.innerComment || ''}
          placeholder="Комментарий для внутреннего использования (только ДКС)"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onChange={(e) => updateFormData('innerComment', e.target.value)}
        />
      </div>

      {/* File Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Документы и вложения</label>
        <FileUpload
          maxSize={25}
          maxFiles={10}
          value={formData.attachments || []}
          onChange={(files) => updateFormData('attachments', files)}
        />
      </div>

      {/* Validation Errors */}
      {getStepErrors('additional').length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <ExclamationMarkIcon className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-sm font-medium text-red-800">Исправьте ошибки:</h3>
          </div>
          <ul className="text-sm text-red-700 space-y-1">
            {getStepErrors('additional').map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Сводка заявки</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Тип перевозки:</span>
            <div className="text-blue-700">{formData._shipmentType?.title || 'Не выбрано'}</div>
          </div>
          <div>
            <span className="font-medium text-blue-800">Вид отгрузки:</span>
            <div className="text-blue-700">
              {formData._transportationType?.title || 'Не выбрано'}
            </div>
          </div>
          <div>
            <span className="font-medium text-blue-800">Количество точек:</span>
            <div className="text-blue-700">{formData.route?.length || 0}</div>
          </div>
          <div>
            <span className="font-medium text-blue-800">Тип ТС:</span>
            <div className="text-blue-700">
              {formData._requiredVehicleType?.title || 'Не выбрано'}
            </div>
          </div>
          <div>
            <span className="font-medium text-blue-800">Валюта:</span>
            <div className="text-blue-700">{formData._currency?.title || 'Не выбрано'}</div>
          </div>
          <div>
            <span className="font-medium text-blue-800">Документов:</span>
            <div className="text-blue-700">{formData.attachments?.length || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderRoute();
      case 2:
        return renderTransport();
      case 3:
        return renderAdditional();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Создание заявки на транспортировку
        </h1>
        <p className="text-gray-600">Заполните все необходимые поля для создания новой заявки</p>
      </div>

      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div
                  className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                  ${
                    isActive
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : isCompleted
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                  }
                `}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div
                    className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 ml-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="mb-8 min-h-[400px]">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{steps[currentStep].title}</h2>
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          className={`
            flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors
            ${
              isSubmitting
                ? 'text-gray-400 cursor-not-allowed'
                : currentStep === 0
                  ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }
          `}
          disabled={isSubmitting}
          onClick={() => {
            if (currentStep === 0 && onCancel) {
              onCancel();
            } else {
              prevStep();
            }
          }}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          {currentStep === 0 ? 'Отменить' : 'Назад'}
        </button>

        <div className="text-sm text-gray-500">
          Шаг {currentStep + 1} из {steps.length}
        </div>

        {currentStep === steps.length - 1 ? (
          <button
            className={`
              flex items-center px-6 py-2 text-sm font-medium rounded-lg transition-colors
              ${
                canSubmit() && !isSubmitting
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
            disabled={!canSubmit() || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Создание...
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Создать заявку
              </>
            )}
          </button>
        ) : (
          <button
            className={`
              flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors
              ${
                canProceed() && !isSubmitting
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
            disabled={!canProceed() || isSubmitting}
            onClick={nextStep}
          >
            Далее
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ShipmentRfpWizard;
