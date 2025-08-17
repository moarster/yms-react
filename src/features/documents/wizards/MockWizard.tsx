import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  PackageIcon,
  FileTextIcon,
  MapPinIcon,
  TruckIcon,
} from '@phosphor-icons/react';
import { useState } from 'react';

// Mock data for demonstration
const mockTransportationTypes = [
  { id: '1', name: 'Автодоставка' },
  { id: '2', name: 'Железнодорожные перевозки' },
  { id: '3', name: 'Авиаперевозки' },
];

const mockShipmentTypes = [
  { id: '1', name: 'Исходящая' },
  { id: '2', name: 'Входящая' },
  { id: '3', name: 'Внутренняя' },
];

const mockCurrencies = [
  { id: '1', name: 'RUB', symbol: '₽' },
  { id: '2', name: 'USD', symbol: '$' },
  { id: '3', name: 'EUR', symbol: '€' },
];

const mockVehicleTypes = [
  { id: '1', name: 'Фура бок, пятитонник' },
  { id: '2', name: 'Еврофура с тентованным полуприцепом' },
  { id: '3', name: 'Рефрижератор' },
];

const mockCargoNatures = [
  { id: '1', name: 'Электротехническая продукция' },
  { id: '2', name: 'Бытовая техника' },
  { id: '3', name: 'Промышленное оборудование' },
];

const mockCounterParties = [
  { id: '1', name: 'ДКС УЛЬТИМА' },
  { id: '2', name: 'Технопарк ДКС' },
  { id: '3', name: 'ЛУЖКИ Грузоотправитель' },
];

const mockCargoHandlingTypes = [
  { id: '1', name: 'Загрузка' },
  { id: '2', name: 'Выгрузка' },
  { id: '3', name: 'Перегрузка' },
];

const MockWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    _currency: '',
    // Transport requirements
    _requiredVehicleType: '',
    // Basic info
    _shipmentType: '',
    _transportationType: '',

    // Comments
    comment: '',

    customRequirements: '',
    express: false,

    innerComment: '',
    // Route
    route: [
      {
        _cargoHandlingType: '',
        _counterParty: '',
        address: '',
        arrival: '',
        cargoList: [
          {
            _cargoNature: '',
            cargoVolume: 0,
            cargoWeight: 0,
            number: '',
          },
        ],
        contactPhone: '',
        departure: '',
      },
    ],
  });

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

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateRouteData = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      route: prev.route.map((point, i) => (i === index ? { ...point, [field]: value } : point)),
    }));
  };

  const updateCargoData = (routeIndex, cargoIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      route: prev.route.map((point, i) =>
        i === routeIndex
          ? {
              ...point,
              cargoList: point.cargoList.map((cargo, j) =>
                j === cargoIndex ? { ...cargo, [field]: value } : cargo,
              ),
            }
          : point,
      ),
    }));
  };

  const addRoutePoint = () => {
    setFormData((prev) => ({
      ...prev,
      route: [
        ...prev.route,
        {
          _cargoHandlingType: '',
          _counterParty: '',
          address: '',
          arrival: '',
          cargoList: [
            {
              _cargoNature: '',
              cargoVolume: 0,
              cargoWeight: 0,
              number: '',
            },
          ],
          contactPhone: '',
          departure: '',
        },
      ],
    }));
  };

  const addCargoItem = (routeIndex) => {
    setFormData((prev) => ({
      ...prev,
      route: prev.route.map((point, i) =>
        i === routeIndex
          ? {
              ...point,
              cargoList: [
                ...point.cargoList,
                {
                  _cargoNature: '',
                  cargoVolume: 0,
                  cargoWeight: 0,
                  number: '',
                },
              ],
            }
          : point,
      ),
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData._shipmentType && formData._transportationType && formData._currency;
      case 1:
        return formData.route.every(
          (point) =>
            point.address &&
            point._counterParty &&
            point._cargoHandlingType &&
            point.cargoList.every((cargo) => cargo.number && cargo._cargoNature),
        );
      case 2:
        return formData._requiredVehicleType;
      default:
        return true;
    }
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
    console.log('Submitting RFP:', formData);
    alert('RFP создана успешно! (В реальном приложении здесь будет API вызов)');
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Вид транспортировки *
          </label>
          <select
            value={formData._shipmentType}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => updateFormData('_shipmentType', e.target.value)}
          >
            <option value="">Выберите</option>
            {mockShipmentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Вид отгрузки *</label>
          <select
            value={formData._transportationType}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => updateFormData('_transportationType', e.target.value)}
          >
            <option value="">Выберите</option>
            {mockTransportationTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Валюта *</label>
          <select
            value={formData._currency}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => updateFormData('_currency', e.target.value)}
          >
            <option value="">Выберите</option>
            {mockCurrencies.map((currency) => (
              <option key={currency.id} value={currency.id}>
                {currency.name} ({currency.symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <input
            id="express"
            type="checkbox"
            checked={formData.express}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            onChange={(e) => updateFormData('express', e.target.checked)}
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
              <MapPinIcon className="h-5 w-5 mr-2 text-blue-500" />
              Точка {routeIndex + 1}
            </h3>
            {formData.route.length > 1 && (
              <button
                className="text-red-600 hover:text-red-800 text-sm"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    route: prev.route.filter((_, i) => i !== routeIndex),
                  }));
                }}
              >
                Удалить
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Адрес *</label>
              <input
                type="text"
                value={point.address}
                placeholder="Введите адрес"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => updateRouteData(routeIndex, 'address', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Контрагент *</label>
              <select
                value={point._counterParty}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => updateRouteData(routeIndex, '_counterParty', e.target.value)}
              >
                <option value="">Выберите</option>
                {mockCounterParties.map((party) => (
                  <option key={party.id} value={party.id}>
                    {party.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип обработки груза *
              </label>
              <select
                value={point._cargoHandlingType}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => updateRouteData(routeIndex, '_cargoHandlingType', e.target.value)}
              >
                <option value="">Выберите</option>
                {mockCargoHandlingTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
              <input
                type="tel"
                value={point.contactPhone}
                placeholder="+7 (900) 000-00-00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => updateRouteData(routeIndex, 'contactPhone', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Плановое время прибытия
              </label>
              <input
                type="datetime-local"
                value={point.arrival}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => updateRouteData(routeIndex, 'arrival', e.target.value)}
              />
            </div>
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
                className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 bg-white rounded border"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Номер груза *
                  </label>
                  <input
                    type="text"
                    value={cargo.number}
                    placeholder="№ груза"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) =>
                      updateCargoData(routeIndex, cargoIndex, 'number', e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Вес (кг)</label>
                  <input
                    step="0.01"
                    type="number"
                    value={cargo.cargoWeight}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) =>
                      updateCargoData(
                        routeIndex,
                        cargoIndex,
                        'cargoWeight',
                        parseFloat(e.target.value) || 0,
                      )
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Объем (м³)</label>
                  <input
                    step="0.01"
                    type="number"
                    value={cargo.cargoVolume}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) =>
                      updateCargoData(
                        routeIndex,
                        cargoIndex,
                        'cargoVolume',
                        parseFloat(e.target.value) || 0,
                      )
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Характер груза *
                  </label>
                  <select
                    value={cargo._cargoNature}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) =>
                      updateCargoData(routeIndex, cargoIndex, '_cargoNature', e.target.value)
                    }
                  >
                    <option value="">Выберите</option>
                    {mockCargoNatures.map((nature) => (
                      <option key={nature.id} value={nature.id}>
                        {nature.name}
                      </option>
                    ))}
                  </select>
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Требуемый тип ТС *</label>
        <select
          value={formData._requiredVehicleType}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onChange={(e) => updateFormData('_requiredVehicleType', e.target.value)}
        >
          <option value="">Выберите тип транспортного средства</option>
          {mockVehicleTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

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
          {formData.customRequirements.length}/1000 символов
        </div>
      </div>
    </div>
  );

  const renderAdditional = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Комментарий</label>
        <textarea
          rows={3}
          maxLength={1000}
          value={formData.comment}
          placeholder="Дополнительные комментарии к заявке"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onChange={(e) => updateFormData('comment', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Внутренний комментарий
        </label>
        <textarea
          rows={3}
          value={formData.innerComment}
          placeholder="Комментарий для внутреннего использования (только ДКС)"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onChange={(e) => updateFormData('innerComment', e.target.value)}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Сводка заявки</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Тип перевозки:</span>
            <div className="text-blue-700">
              {mockShipmentTypes.find((t) => t.id === formData._shipmentType)?.name || 'Не выбрано'}
            </div>
          </div>
          <div>
            <span className="font-medium text-blue-800">Вид отгрузки:</span>
            <div className="text-blue-700">
              {mockTransportationTypes.find((t) => t.id === formData._transportationType)?.name ||
                'Не выбрано'}
            </div>
          </div>
          <div>
            <span className="font-medium text-blue-800">Количество точек:</span>
            <div className="text-blue-700">{formData.route.length}</div>
          </div>
          <div>
            <span className="font-medium text-blue-800">Тип ТС:</span>
            <div className="text-blue-700">
              {mockVehicleTypes.find((t) => t.id === formData._requiredVehicleType)?.name ||
                'Не выбрано'}
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
                  {isCompleted ? <Check className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
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
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }
          `}
          disabled={currentStep === 0}
          onClick={prevStep}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Назад
        </button>

        <div className="text-sm text-gray-500">
          Шаг {currentStep + 1} из {steps.length}
        </div>

        {currentStep === steps.length - 1 ? (
          <button
            className="flex items-center px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            onClick={handleSubmit}
          >
            <CheckIcon className="h-4 w-4 mr-2" />
            Создать заявку
          </button>
        ) : (
          <button
            className={`
              flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors
              ${
                canProceed()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
            disabled={!canProceed()}
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

export default MockWizard;
