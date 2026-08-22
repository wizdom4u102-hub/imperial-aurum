import React from 'react';

interface DepositMethodCardProps {
  methodName: string;
  description: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

const DepositMethodCard: React.FC<DepositMethodCardProps> = ({
  methodName,
  description,
  icon,
  selected,
  onClick,
}) => {
  return (
    <div className={`p-4 border rounded-lg shadow-md cursor-pointer ${selected ? 'border-blue-500' : 'border-gray-300'} hover:bg-gray-100`} onClick={onClick}>
      <div className="flex items-center">
        {icon && <div className="mr-2">{icon}</div>}
        <h3 className="font-semibold text-lg">{methodName}</h3>
      </div>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );
};

export default DepositMethodCard;