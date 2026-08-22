import React from 'react';
import StatusTimelineItem from './status-timeline-item';
import StatusBadge from './status-badge';

interface TimelineItem {
  status: 'Active' | 'Pending' | 'Completed' | 'Paused' | 'Expired' | 'Failed';
  title: string;
  description: string;
  timestamp: string;
  icon?: React.ReactNode;
}

interface BotStatusTimelineProps {
  currentStatus: string;
  timelineItems: TimelineItem[];
}

const BotStatusTimeline: React.FC<BotStatusTimelineProps> = ({ currentStatus, timelineItems }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Bot Status Timeline</h2>
      <StatusBadge status={currentStatus as any} />
      <div className="border-t mt-4 pt-4">
        {timelineItems.length === 0 ? (
          <div className="text-center text-gray-500">No Status Events Available</div>
        ) : (
          timelineItems.map(item => (
            <StatusTimelineItem
              key={item.timestamp}
              status={item.status}
              title={item.title}
              description={item.description}
              timestamp={item.timestamp}
              icon={item.icon}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BotStatusTimeline;