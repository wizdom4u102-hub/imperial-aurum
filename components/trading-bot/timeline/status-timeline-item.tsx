import React from 'react';
import StatusBadge from './status-badge';

interface TimelineItemProps {
  status: 'Active' | 'Pending' | 'Completed' | 'Paused' | 'Expired' | 'Failed';
  title: string;
  description: string;
  timestamp: string;
  icon?: React.ReactNode;
}

const StatusTimelineItem: React.FC<TimelineItemProps> = ({ status, title, description, timestamp, icon }) => {
  return (
    <div className="flex items-start mb-4">
      <div className="flex flex-col items-center">
        <div className="h-4 w-4 bg-gray-400 rounded-full" />
        <div className="h-2 bg-gray-400 w-px rounded-full" style={{ height: '100%' }} />
      </div>
      <div className="ml-4 bg-white p-4 rounded-lg border shadow-md flex-grow">
        <StatusBadge status={status} />
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <small className="text-gray-500">{new Date(timestamp).toLocaleString()}</small>
      </div>
    </div>
  );
};

export default StatusTimelineItem;