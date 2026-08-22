import React from 'react';

interface InfoItem {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

interface BotInformationListProps {
  information: InfoItem[];
}

const BotInformationList: React.FC<BotInformationListProps> = ({ information }) => {
  return (
    <div className="bg-white rounded-lg shadow-md divide-y">
      {information.map((item, index) => (
        <div key={index} className="flex items-center justify-between p-4">
          <div className="flex items-center">
            {item.icon && <div className="mr-2">{item.icon}</div>}
            <span className="font-semibold">{item.label}</span>
          </div>
          <span className="text-gray-600">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default BotInformationList;