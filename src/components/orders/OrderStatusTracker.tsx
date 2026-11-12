import React from 'react';
import { Check } from 'lucide-react';
import { ORDER_STATUSES, OrderStatus } from '../../lib/orders';

const OrderStatusTracker: React.FC<{ currentStatus: OrderStatus }> = ({ currentStatus }) => {
  const currentStepIndex = Math.max(0, ORDER_STATUSES.findIndex((s) => s.key === currentStatus));
  const currentMessage = ORDER_STATUSES[currentStepIndex].message;

  return (
    <div>
      {/* Desktop: horizontal */}
      <ol className="hidden md:flex items-center justify-between" aria-label="Andamento do pedido">
        {ORDER_STATUSES.map((status, index) => {
          const isActive = index <= currentStepIndex;
          const isCurrentStep = index === currentStepIndex;
          return (
            <React.Fragment key={status.key}>
              <li className="flex flex-col items-center text-center" aria-current={isCurrentStep ? 'step' : undefined}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isActive ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                  } ${isCurrentStep ? 'ring-4 ring-purple-200' : ''}`}
                >
                  {isActive ? <Check size={20} aria-hidden /> : <span className="font-bold">{index + 1}</span>}
                </div>
                <div className={`text-xs mt-2 font-medium ${isActive ? 'text-purple-700' : 'text-gray-500'}`}>{status.label}</div>
              </li>
              {index < ORDER_STATUSES.length - 1 && (
                <li aria-hidden className={`flex-grow h-1 mx-4 transition-colors duration-500 ${index < currentStepIndex ? 'bg-purple-600' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </ol>
      <p className="hidden md:block text-center bg-purple-50 p-4 mt-8 rounded-lg font-semibold text-purple-800" aria-live="polite">
        {currentMessage}
      </p>

      {/* Mobile: vertical */}
      <ol className="md:hidden" aria-label="Andamento do pedido">
        {ORDER_STATUSES.map((status, index) => {
          const isActive = index <= currentStepIndex;
          const isCurrentStep = index === currentStepIndex;
          return (
            <li key={status.key} className="flex" aria-current={isCurrentStep ? 'step' : undefined}>
              <div className="flex flex-col items-center mr-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                  } ${isCurrentStep ? 'ring-4 ring-purple-200' : ''}`}
                >
                  {isActive ? <Check size={20} aria-hidden /> : <span className="font-bold text-lg">{index + 1}</span>}
                </div>
                {index < ORDER_STATUSES.length - 1 && (
                  <div className={`w-0.5 flex-grow my-1 ${index < currentStepIndex ? 'bg-purple-600' : 'bg-gray-200'}`} />
                )}
              </div>
              <div className={`pb-8 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                <p className={`font-bold text-lg ${isCurrentStep ? 'text-purple-700' : 'text-gray-800'}`}>{status.label}</p>
                {isCurrentStep && <p className="text-sm text-gray-600 mt-1">{status.message}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default OrderStatusTracker;
