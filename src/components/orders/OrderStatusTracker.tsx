import React from 'react';
import { Check } from 'lucide-react';

interface OrderStatusTrackerProps {
  currentStatus: 'pendente' | 'em preparo' | 'pronto' | 'saiu para entrega' | 'entregue';
}

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ currentStatus }) => {
  // Estrutura de dados melhorada: mensagens incluídas aqui
  const statuses = [
    { key: 'pendente', label: 'Pendente', message: 'Seu pedido foi recebido e está aguardando confirmação.' },
    { key: 'em preparo', label: 'Em Preparo', message: 'Nossos chefs estão preparando seu delicioso açaí!' },
    { key: 'pronto', label: 'Pronto', message: 'Seu pedido está pronto e será enviado em breve.' },
    { key: 'saiu para entrega', label: 'Saiu para entrega', message: 'O entregador está a caminho com seu pedido!' },
    { key: 'entregue', label: 'Entregue', message: 'Seu pedido foi entregue. Bom apetite!' }
  ];
  
  const currentStepIndex = statuses.findIndex(status => status.key === currentStatus);
  const currentMessage = statuses[currentStepIndex]?.message || '';

  return (
    <div>
      {/* ======================================================= */}
      {/* ========= RASTREADOR HORIZONTAL (DESKTOP) ========= */}
      {/* ======================================================= */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {statuses.map((status, index) => {
            const isActive = index <= currentStepIndex;
            const isCurrentStep = index === currentStepIndex;
            return (
              <React.Fragment key={status.key}>
                <div className="flex flex-col items-center text-center">
                  <div className={`relative flex-shrink-0 ${isCurrentStep ? 'animate-pulse' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {isActive ? <Check size={20} /> : <span className="font-bold">{index + 1}</span>}
                    </div>
                  </div>
                  <div className={`text-xs mt-2 font-medium transition-colors duration-300 ${isActive ? 'text-purple-700' : 'text-gray-500'}`}>
                    {status.label}
                  </div>
                </div>
                {index < statuses.length - 1 && (
                  <div className={`flex-grow h-1 mx-4 transition-colors duration-500 ${index < currentStepIndex ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="text-center bg-purple-50 p-4 mt-8 rounded-lg">
          <p className="font-semibold text-purple-800">{currentMessage}</p>
        </div>
      </div>

      {/* =================================================== */}
      {/* ========= RASTREADOR VERTICAL (MOBILE) ========== */}
      {/* =================================================== */}
      <div className="md:hidden">
        {statuses.map((status, index) => {
          const isActive = index <= currentStepIndex;
          const isCurrentStep = index === currentStepIndex;
          
          return (
            <div key={status.key} className="flex">
              {/* Coluna da Linha e Círculo */}
              <div className="flex flex-col items-center mr-4">
                <div className={`relative flex-shrink-0 ${isCurrentStep ? 'animate-pulse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {isActive ? <Check size={20} /> : <span className="font-bold text-lg">{index + 1}</span>}
                  </div>
                </div>
                {/* Linha conectora vertical */}
                {index < statuses.length - 1 && (
                  <div className={`w-0.5 flex-grow my-1 transition-colors duration-500 ${isActive ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                )}
              </div>
              
              {/* Coluna do Conteúdo */}
              <div className={`pb-8 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                <p className={`font-bold text-lg ${isCurrentStep ? 'text-purple-700' : 'text-gray-800'}`}>
                  {status.label}
                </p>
                {/* Mostra a mensagem apenas na etapa atual para um foco claro */}
                {isCurrentStep && (
                  <p className="text-sm text-gray-600 mt-1">
                    {status.message}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTracker;