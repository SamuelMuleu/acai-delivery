import React from 'react';

interface AddressFormProps {
  address: string;
  setAddress: (address: string) => void;
  error?: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, setAddress, error }) => {
  return (
    <div>
      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
        Endereço completo
      </label>
      <textarea
        id="address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        rows={3}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder="Rua, número, bairro, complemento, cidade"
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default AddressForm;