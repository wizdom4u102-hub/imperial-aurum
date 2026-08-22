import React from 'react';

interface StatusBadgeProps {
  status: 'Active' | 'Pending' | 'Completed' | 'Paused' | 'Expired' | 'Failed';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles = {
    Active: 'bg-green-500 text-white',
    Pending: 'bg-yellow-500 text-white',
    Completed: 'bg-blue-500 text-white',
    Paused: 'bg-orange-500 text-white',
    Expired: 'bg-red-500 text-white',
    Failed: 'bg-gray-500 text-white',
  };

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>{status}</span>
  );
};

export default StatusBadge;