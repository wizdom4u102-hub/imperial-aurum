import { useState, useMemo } from 'react';

interface Bot {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'paused' | 'expired' | 'completed' | 'failed';
  riskLevel: 'low' | 'medium' | 'high';
  strategy: string;
}

interface UseBotFilterProps {
  bots: Bot[];
}

const useBotFilter = ({ bots }: UseBotFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  const filteredBots = useMemo(() => {
    return bots.filter(bot => {
      const matchesSearchTerm = bot.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus ? bot.status === selectedStatus : true;
      const matchesRiskLevel = selectedRiskLevel ? bot.riskLevel === selectedRiskLevel : true;
      const matchesStrategy = selectedStrategy ? bot.strategy === selectedStrategy : true;
      return matchesSearchTerm && matchesStatus && matchesRiskLevel && matchesStrategy;
    });
  }, [bots, searchTerm, selectedStatus, selectedRiskLevel, selectedStrategy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus(null);
    setSelectedRiskLevel(null);
    setSelectedStrategy(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedRiskLevel,
    setSelectedRiskLevel,
    selectedStrategy,
    setSelectedStrategy,
    filteredBots,
    clearFilters,
  };
};

export default useBotFilter;