import { useState, useEffect } from 'react';

interface ComplementsListProps {
  complements: Array<{
    id: number;
    nome: string;
    tipo: string;
  }>;
  selectedComplements: number[];
  toggleComplement: (id: number) => void;
}


const COMPLEMENT_LIMITS: Record<string, number> = {
  'fruta': 1,
  'cobertura': 1,
  'adicional': 3,

};

export const ComplementsList = ({
  complements,
  selectedComplements,
  toggleComplement
}: ComplementsListProps) => {
  const [warnings, setWarnings] = useState<Record<string, string>>({});

  // Agrupa complementos por tipo e calcula quantos estão selecionados em cada tipo
  const complementsByType = complements.reduce((acc, complement) => {
    if (!acc[complement.tipo]) {
      acc[complement.tipo] = {
        items: [],
        selectedCount: 0,
        limit: COMPLEMENT_LIMITS[complement.tipo] || COMPLEMENT_LIMITS['default']
      };
    }
    acc[complement.tipo].items.push(complement);
    if (selectedComplements.includes(complement.id)) {
      acc[complement.tipo].selectedCount++;
    }
    return acc;
  }, {} as {
    [key: string]: {
      items: typeof complements;
      selectedCount: number;
      limit: number;
    }
  });

  // Limpa os avisos após 2 segundos
  useEffect(() => {
    if (Object.keys(warnings).length > 0) {
      const timer = setTimeout(() => setWarnings({}), 2000);
      return () => clearTimeout(timer);
    }
  }, [warnings]);

  const handleToggle = (id: number, tipo: string) => {
    const group = complementsByType[tipo];
    const isSelected = selectedComplements.includes(id);

    // Verifica se pode selecionar mais itens neste grupo
    if (!isSelected && group.selectedCount >= group.limit) {
      setWarnings(prev => ({
        ...prev,
        [tipo]: `Limite de ${group.limit} item(s) alcançado para ${tipo.toLowerCase()}`
      }));
      return;
    }

    toggleComplement(id);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Escolha os complementos:</h3>

      {/* Mostra avisos específicos para cada grupo */}
      {Object.keys(warnings).map(tipo => (
        <div key={tipo} className="mb-3 p-2 bg-red-100 text-red-800 rounded">
          {warnings[tipo]}
        </div>
      ))}

      {Object.entries(complementsByType).map(([tipo, { items, selectedCount, limit }]) => (
        <div key={tipo} className="mb-4">
          <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-extrabold text-gray-700  tracking-wider">
  {tipo.trim() === 'fruta' ? 'Batido com: ' : tipo}
</h4>
            {limit > 0 && (
              <span className="text-xs text-gray-500">
                {selectedCount}/{limit} selecionados
              </span>
            )}
          </div>

          {selectedCount >= limit && (
            <div className="mb-2 p-2 bg-green-100 text-green-800 rounded text-sm flex items-center gap-2">
              <span>Limite para {tipo.toLowerCase()} alcançado</span>
              <span className="text-xl">✅</span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {items.map((complement) => {
              const isSelected = selectedComplements.includes(complement.id);
              // Verifica se o item está desabilitado (limite atingido e não selecionado)
              const isDisabled = !isSelected && selectedCount >= limit;

              return (
                <div
                  key={complement.id}
                  className={`border rounded-lg py-2 px-3 flex items-center cursor-pointer transition-all
                    ${isSelected
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300'}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => !isDisabled && handleToggle(complement.id, tipo)}
                >
                  <div className="mr-2">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center
                      ${isSelected ? 'border-purple-600' : 'border-gray-400'}`}>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      )}
                    </div>
                  </div>
                  <span className="text-sm">{complement.nome}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

