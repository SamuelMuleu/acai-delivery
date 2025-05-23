import React from 'react';
import { MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';

const StoreStatus: React.FC = () => {
    // Mock: depois isso vem do backend ou contexto de admin
    const isOpen = true;

    return (
        <div className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-2 mb-4 border">
            <div className="flex items-center gap-2">
                {isOpen ? (
                    <CheckCircle className="text-green-600 w-5 h-5" />
                ) : (
                    <XCircle className="text-red-600 w-5 h-5" />
                )}
                <span className={`font-semibold ${isOpen ? 'text-green-700' : 'text-red-700'}`}>
                    Loja {isOpen ? 'Aberta' : 'Fechada'}
                </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-gray-500" />
                Horários de Funcionamento: <strong>12:00 às 19:40</strong>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
                <MapPin className="w-4 h-4 text-gray-500" />
                Rua Raimundo de Farias Brito, 235 - Parque Rodoviario - Campos dos Goytacazes-RJ - 28010-117
            </div>
        </div>
    );
};

export default StoreStatus;
