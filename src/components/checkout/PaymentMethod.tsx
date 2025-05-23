import React from 'react';

interface PaymentMethodProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ id, label, icon, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`border rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
        selected 
          ? 'border-purple-600 bg-purple-50 text-purple-700' 
          : 'border-gray-200 hover:border-purple-300'
      }`}
    >
      <div className={`p-3 rounded-full mb-2 ${selected ? 'bg-purple-100' : 'bg-gray-100'}`}>
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </div>
  );
};

export default PaymentMethod;