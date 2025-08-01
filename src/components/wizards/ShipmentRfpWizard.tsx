// noinspection D

import {
    ArrowLeftIcon as ArrowLeft,
    ArrowRightIcon as ArrowRight,
    CheckIcon as Check,
    CubeIcon as Package,
    DocumentTextIcon as FileText,
    ExclamationCircleIcon as AlertCircle,
    MapPinIcon as MapPin,
    TruckIcon as Truck,
} from '@heroicons/react/24/outline';
import React, {useEffect, useState} from 'react';

import FileUpload from '@/components/form/FileUpload';
import {useWizardValidation} from '@/hooks/useWizardValidation';
import {BaseEntity, Cargo, isBaseEntity, RoutePoint, ShipmentRfpWizardProps, WizardFormData} from '@/types';
import {createCargo, createRoutePoint, LinkFactories} from '@/types/factories/linkFactory'

const ShipmentRfpWizard: React.FC<ShipmentRfpWizardProps> = ({
                                                                 initialData,
                                                                 lists,
                                                                 onSubmit,
                                                                 onCancel,
                                                                 isSubmitting = false
                                                             }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<WizardFormData>(initialData);
    const {getStepErrors, canProceedToNext, canSubmit} = useWizardValidation(formData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const steps = [
        {
            id: 'basic',
            title: 'Основная информация',
            icon: FileText,
            description: 'Тип перевозки и базовые параметры'
        },
        {
            id: 'route',
            title: 'Маршрут и груз',
            icon: MapPin,
            description: 'Точки загрузки/выгрузки и описание груза'
        },
        {
            id: 'transport',
            title: 'Требования к ТС',
            icon: Truck,
            description: 'Тип транспорта и особые требования'
        },
        {
            id: 'additional',
            title: 'Дополнительно',
            icon: Package,
            description: 'Комментарии и завершение'
        }
    ];

    const updateFormData = (
        field: keyof WizardFormData,
        value: unknown
    ) => {
        setFormData(prev => {
            if (typeof field === 'string' && field.startsWith('_')) {
                const existingValue = prev[field];


                if (typeof existingValue === 'object' && existingValue !== null && 'id' in existingValue && isBaseEntity(value)) {
                    return {
                        ...prev,
                        [field]: {
                            ...existingValue,
                            id: value.id,
                            title: value.title,
                            entry: value
                        }
                    };
                }
            }

            return {
                ...prev,
                [field]: value
            };
        });
    };

    const updateRouteData = (index: number, field: keyof RoutePoint, value: unknown) => {
        setFormData(prev => ({
            ...prev,
            route: prev.route?.map((point, i) => {
                if (i !== index) return point;

                if (typeof field === 'string' && field.startsWith('_')) {
                    const existingValue = point[field];

                    // Handle reference field updates
                    if (typeof existingValue === 'object' && existingValue !== null && 'id' in existingValue && isBaseEntity(value)) {
                        if (isBaseEntity(value))
                            return {
                                ...point,
                                [field]: {
                                    ...existingValue,
                                    id: value.id,
                                    title: value.title,
                                    entry: value
                                }
                            };
                        else return {
                            ...point,
                            [field]: {
                                ...existingValue,
                                id: value
                            }
                        };
                    }
                }

                return {...point, [field]: value};
            }) || []
        }));
    };

    const updateCargoData = (routeIndex: number, cargoIndex: number, field: keyof Cargo, value: unknown) => {
        setFormData(prev => ({
            ...prev,
            route: prev.route?.map((point, i) => {
                if (i !== routeIndex) return point;

                return {
                    ...point,
                    cargoList: point.cargoList?.map((cargo, j) => {
                        if (j !== cargoIndex) return cargo;

                        if (field.startsWith('_')) {
                            const existingValue = cargo[field];

                            // Handle reference field updates for cargo
                            if (typeof existingValue === 'object' && existingValue !== null && 'id' in existingValue) {
                                if (isBaseEntity(value))
                                    return {
                                        ...cargo,
                                        [field]: {
                                            ...existingValue,
                                            id: value.id,
                                            title: value.title,
                                            entry: value
                                        }
                                    };
                                else return {
                                    ...cargo,
                                    [field]: {
                                        ...existingValue,
                                        id: value,
                                    }
                                };
                            }
                        }

                        return {...cargo, [field]: value};
                    }) || []
                };
            }) || []
        }));
    };

    const addRoutePoint = () => {
        setFormData(prev => ({
            ...prev,
            route: [...(prev.route || []), createRoutePoint()]
        }));
    };

    const addCargoItem = (routeIndex: number) => {
        setFormData(prev => ({
            ...prev,
            route: prev.route?.map((point, i) =>
                i === routeIndex ? {
                    ...point,
                    cargoList: [...(point.cargoList || []), createCargo()]
                } : point
            ) || []
        }));
    };
    const removeCargoItem = (routeIndex: number, cargoIndex: number) => {
        setFormData(prev => ({
            ...prev,
            route: prev.route?.map((point, i) =>
                i === routeIndex ? {
                    ...point,
                    cargoList: point.cargoList?.filter((_, j) => j !== cargoIndex) || []
                } : point
            ) || []
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

    const updateReferenceField = <T extends keyof WizardFormData>(
        field: T,
        selectedId: string,
        options: BaseEntity[],
        emptyValue: () => WizardFormData[T]
    ) => {
        const selected = options.find(item => item.id === selectedId);
        updateFormData(field, selected || emptyValue());
    };
    const renderBasicInfo = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Вид транспортировки *
                    </label>
                    <select
                        value={formData._shipmentType?.id || ''}
                        onChange={(e) =>
                            updateReferenceField('_shipmentType', e.target.value, lists.shipmentTypes, LinkFactories.shipmentType)}

                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Выберите</option>
                        {lists.shipmentTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.title}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Вид отгрузки *
                    </label>
                    <select
                        value={formData._transportationType?.id || ''}
                        onChange={(e) =>
                            updateReferenceField('_transportationType', e.target.value, lists.transportationTypes, LinkFactories.transportationType)}

                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Выберите</option>
                        {lists.transportationTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.title}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Валюта *
                    </label>
                    <select
                        value={formData._currency?.id || ''}
                        onChange={(e) =>
                            updateReferenceField('_currency', e.target.value, lists.currencies, LinkFactories.currency)}

                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Выберите</option>
                        {lists.currencies.map(currency => (
                            <option key={currency.id} value={currency.id}>{currency.title}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="express"
                        checked={formData.express}
                        onChange={(e) => updateFormData('express', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="express" className="ml-2 text-sm text-gray-700">
                        Экспресс отгрузка
                    </label>
                </div>
            </div>
        </div>
    );

    const renderRoute = () => (
        <div className="space-y-6">
            {formData.route.map((point, routeIndex) => (
                <div key={routeIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-blue-500"/>
                            Точка {routeIndex + 1}
                        </h3>
                        {formData.route.length > 1 && (
                            <button
                                onClick={() => {
                                    setFormData(prev => ({
                                        ...prev,
                                        route: prev.route.filter((_, i) => i !== routeIndex)
                                    }));
                                }}
                                className="text-red-600 hover:text-red-800 text-sm"
                            >
                                Удалить
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Адрес *
                            </label>
                            <input
                                type="text"
                                value={point.address}
                                onChange={(e) => updateRouteData(routeIndex, 'address', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Введите адрес"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Контрагент *
                            </label>
                            <select
                                value={point._counterParty.id}
                                onChange={(e) => {
                                    const selected = lists.counterParties.find(t => t.id === e.target.value);
                                    updateRouteData(routeIndex, '_counterParty', selected || LinkFactories.counterParty);
                                }}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Выберите</option>
                                {lists.counterParties.map(party => (
                                    <option key={party.id} value={party.id}>{party.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Тип обработки груза *
                            </label>
                            <select
                                value={point._cargoHandlingType.title}
                                onChange={(e) => {
                                    const selected = lists.cargoHandlingTypes.find(t => t.id === e.target.value);
                                    updateRouteData(routeIndex, '_cargoHandlingType', selected || LinkFactories.cargoHandlingType());
                                }}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Выберите</option>
                                {lists.cargoHandlingTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Телефон
                            </label>
                            <input
                                type="tel"
                                value={point.contactPhone}
                                onChange={(e) => updateRouteData(routeIndex, 'contactPhone', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="+7 (900) 000-00-00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Плановое время прибытия
                            </label>
                            <input
                                type="datetime-local"
                                value={point.arrival}
                                onChange={(e) => updateRouteData(routeIndex, 'arrival', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-md font-medium text-gray-900 flex items-center">
                                <Package className="h-4 w-4 mr-2 text-green-500"/>
                                Грузы
                            </h4>
                            <button
                                onClick={() => addCargoItem(routeIndex)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                + Добавить груз
                            </button>
                        </div>

                        {point.cargoList.map((cargo, cargoIndex) => (
                            <div key={cargoIndex}
                                 className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 p-3 bg-white rounded border">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Номер груза *
                                    </label>
                                    <input
                                        type="text"
                                        value={cargo.number}
                                        onChange={(e) => updateCargoData(routeIndex, cargoIndex, 'number', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="№ груза"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Вес (кг)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={cargo.cargoWeight}
                                        onChange={(e) => updateCargoData(routeIndex, cargoIndex, 'cargoWeight', parseFloat(e.target.value) || 0)}
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Объем (м³)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={cargo.cargoVolume}
                                        onChange={(e) => updateCargoData(routeIndex, cargoIndex, 'cargoVolume', parseFloat(e.target.value) || 0)}
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Характер груза *
                                    </label>
                                    <select

                                        value={cargo._cargoNature.id}
                                        onChange={(e) => {
                                            const selected = lists.cargoNatures.find(t => t.id === e.target.value);
                                            updateCargoData(routeIndex, cargoIndex, '_cargoNature', selected || LinkFactories.cargoNature());
                                        }}
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Выберите</option>
                                        {lists.cargoNatures.map(nature => (
                                            <option key={nature.id} value={nature.id}>{nature.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end justify-center">
                                    {point.cargoList.length > 1 && (
                                        <button
                                            onClick={() => removeCargoItem(routeIndex, cargoIndex)}
                                            className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border border-red-300 rounded hover:bg-red-50"
                                            title="Remove this cargo item"
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
                onClick={addRoutePoint}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
                + Добавить точку маршрута
            </button>
        </div>
    );

    const renderTransport = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Требуемый тип ТС *
                </label>
                <select
                    value={formData._requiredVehicleType?.id}
                    onChange={(e) =>
                        updateReferenceField('_requiredVehicleType', e.target.value, lists.vehicleTypes, LinkFactories.vehicleType)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Выберите тип транспортного средства</option>
                    {lists.vehicleTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.title}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Особые требования
                </label>
                <textarea
                    value={formData.customRequirements}
                    onChange={(e) => updateFormData('customRequirements', e.target.value)}
                    rows={4}
                    maxLength={1000}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Водитель Исполнителя обязан в соответствии с п. 5.16. договора проверить надлежащую расстановку груза с целью исключения превышения максимально допустимой нагрузки на ось и с учетом допустимой массы ТС, в том числе указанных в специальном разрешении."
                />
                <div className="text-sm text-gray-500 mt-1">
                    {formData.customRequirements.length}/1000 символов
                </div>
            </div>
        </div>
    );

    const renderAdditional = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Комментарий
                </label>
                <textarea
                    value={formData.comment || ''}
                    onChange={(e) => updateFormData('comment', e.target.value)}
                    rows={3}
                    maxLength={1000}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Дополнительные комментарии к заявке"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Внутренний комментарий
                </label>
                <textarea
                    value={formData.innerComment || ''}
                    onChange={(e) => updateFormData('innerComment', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Комментарий для внутреннего использования (только ДКС)"
                />
            </div>

            {/* File Upload Section */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Документы и вложения
                </label>
                <FileUpload
                    value={formData.attachments || []}
                    onChange={(files) => updateFormData('attachments', files)}
                    maxFiles={10}
                    maxSize={25}
                />
            </div>

            {/* Validation Errors */}
            {getStepErrors('additional').length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                        <AlertCircle className="h-5 w-5 text-red-400 mr-2"/>
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
                        <div className="text-blue-700">
                            {formData._shipmentType?.title || 'Не выбрано'}
                        </div>
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
                        <div className="text-blue-700">
                            {formData._currency?.title || 'Не выбрано'}
                        </div>
                    </div>
                    <div>
                        <span className="font-medium text-blue-800">Документов:</span>
                        <div className="text-blue-700">
                            {formData.attachments?.length || 0}
                        </div>
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
                <p className="text-gray-600">
                    Заполните все необходимые поля для создания новой заявки
                </p>
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
                                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                  ${isActive ? 'border-blue-500 bg-blue-500 text-white' :
                                    isCompleted ? 'border-green-500 bg-green-500 text-white' :
                                        'border-gray-300 bg-white text-gray-400'}
                `}>
                                    {isCompleted ? <Check className="h-5 w-5"/> : <StepIcon className="h-5 w-5"/>}
                                </div>
                                <div className="ml-3 flex-1">
                                    <div
                                        className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                                        {step.title}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {step.description}
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-12 h-0.5 ml-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}/>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step content */}
            <div className="mb-8 min-h-[400px]">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        {steps[currentStep].title}
                    </h2>
                    {renderStepContent()}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => {
                        if (currentStep === 0 && onCancel) {
                            onCancel();
                        } else {
                            prevStep();
                        }
                    }}
                    disabled={isSubmitting}
                    className={`
            flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors
            ${isSubmitting
                        ? 'text-gray-400 cursor-not-allowed'
                        : currentStep === 0
                            ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                            : 'text-gray-700 bg-gray-100 hover:bg-gray-200'}
          `}
                >
                    <ArrowLeft className="h-4 w-4 mr-2"/>
                    {currentStep === 0 ? 'Отменить' : 'Назад'}
                </button>

                <div className="text-sm text-gray-500">
                    Шаг {currentStep + 1} из {steps.length}
                </div>

                {currentStep === steps.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit() || isSubmitting}
                        className={`
              flex items-center px-6 py-2 text-sm font-medium rounded-lg transition-colors
              ${canSubmit() && !isSubmitting
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            `}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Создание...
                            </>
                        ) : (
                            <>
                                <Check className="h-4 w-4 mr-2"/>
                                Создать заявку
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        onClick={nextStep}
                        disabled={!canProceed() || isSubmitting}
                        className={`
              flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors
              ${canProceed() && !isSubmitting
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            `}
                    >
                        Далее
                        <ArrowRight className="h-4 w-4 ml-2"/>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ShipmentRfpWizard;