import { useState } from 'react';

interface BotProps {
  name: string;
  description: string;
  strategy: string;
  expectedROI: number;
  minimumDeposit: number;
  maximumDeposit: number;
}

const useTradingBotModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<BotProps | null>(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    modalData,
    setModalData,
    clearModalData: () => setModalData(null),
  };
};

export default useTradingBotModal;