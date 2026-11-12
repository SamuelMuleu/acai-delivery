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
    <button
      type="button"
      id={`payment-${id}`}
      onClick={onClick}
      aria-pressed={selected}
      className={`border rounded-lg p-4 flex flex-col items-center justify-center text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
        selected ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-300'
      }`}
    >
      <span className={`p-3 rounded-full mb-2 ${selected ? 'bg-purple-100' : 'bg-gray-100'}`} aria-hidden>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default PaymentMethod;
