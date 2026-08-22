import { useState } from 'react';

interface Bot {
  id: string;
}

const useBotSelection = () => {
  const [selectedBots, setSelectedBots] = useState<Bot[]>([]);

  const selectBot = (bot: Bot) => {
    setSelectedBots((prev) => [...prev, bot]);
  };

  const deselectBot = (botId: string) => {
    setSelectedBots((prev) => prev.filter(bot => bot.id !== botId));
  };

  const toggleBotSelection = (bot: Bot) => {
    setSelectedBots((prev) => {
      const isSelected = prev.some(existingBot => existingBot.id === bot.id);
      return isSelected ? prev.filter(existingBot => existingBot.id !== bot.id) : [...prev, bot];
    });
  };

  const clearSelection = () => {
    setSelectedBots([]);
  };

  const isSelected = (botId: string) => {
    return selectedBots.some(bot => bot.id === botId);
  };

  return {
    selectedBots,
    selectBot,
    deselectBot,
    toggleBotSelection,
    clearSelection,
    isSelected,
  };
};

export default useBotSelection;