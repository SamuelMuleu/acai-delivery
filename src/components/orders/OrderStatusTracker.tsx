import React from 'react';
import { Check } from 'lucide-react';

interface OrderStatusTrackerProps {
  currentStatus: 'pendente' | 'em preparo' | 'pronto' | 'saiu para entrega' | 'entregue';
}

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ currentStatus }) => {
  const statuses = [
    { key: 'pendente', label: 'Pendente' },
    { key: 'em Preparo', label: 'Em Preparo' },
    { key: 'pronto', label: 'Pronto' },
    { key: 'saiu para entrega', label: 'Saiu para entrega' },
    { key: 'entregue', label: 'Entregue' }
  ];
  
  const currentStep = statuses.findIndex(status => status.key === currentStatus);
  
  // Get a message based on the current status
  const getMessage = () => {
    switch (currentStatus) {
      case 'pendente':
        return 'Seu pedido foi recebido e está aguardando confirmação.';
      case 'em preparo':
        return 'Nossos chefs estão preparando seu delicioso açaí!';
      case 'pronto':
        return 'Seu pedido está pronto e será enviado em breve.';
      case 'saiu para entrega':
        return 'O entregador está a caminho com seu pedido!';
      case 'entregue':
        return 'Seu pedido foi entregue. Bom apetite!';
      default:
        return '';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        {statuses.map((status, index) => {
          const isActive = index <= currentStep;
          const isCurrentStep = index === currentStep;
          
          return (
            <React.Fragment key={status.key}>
              {/* Step circle */}
              <div className={`relative flex-shrink-0 ${isCurrentStep ? 'animate-pulse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {isActive ? <Check size={20} /> : index + 1}
                </div>
                <div className="text-xs text-center mt-2 font-medium whitespace-nowrap">
                  {status.label}
                </div>
              </div>
              
              {/* Connector line */}
              {index < statuses.length - 1 && (
                <div className={`flex-grow h-1 mx-2 ${
                  index < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                }`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      <div className="text-center bg-purple-50 p-4 rounded-lg animate-fadeIn">
        <p className="text-lg text-purple-700">{getMessage()}</p>
      </div>
    </div>
  );
};

export default OrderStatusTracker;