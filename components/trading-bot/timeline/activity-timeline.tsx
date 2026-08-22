"use client";

import React from "react";

interface ActivityItem {
  id?: string;
  title: string;
  description?: string;
  timestamp?: string;
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
  loading: boolean;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  loading,
}) => {

  console.log("Timeline received:", activities);
console.log("Timeline length:", activities.length);

  return (
    <section
      className="
        rounded-2xl
        border
        border-white/10
        bg-[#0b1020]/80
        backdrop-blur-xl
        p-6
        shadow-xl
      "
    >
      <div className="mb-6">
        <h2
          className="
            text-xl
            font-bold
            bg-gradient-to-r
            from-yellow-300
            via-yellow-400
            to-amber-500
            bg-clip-text
            text-transparent
          "
        >
          Activity Timeline
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Monitor the latest trading bot events and account activity.
        </p>
      </div>

      {loading ? (
        <div
          className="
            flex
            h-40
            items-center
            justify-center
            rounded-xl
            border
            border-dashed
            border-white/10
            bg-black/20
            text-sm
            text-gray-400
          "
        >
          Loading activities...
        </div>
      ) : activities.length === 0 ? (
        <div
          className="
            flex
            h-40
            flex-col
            items-center
            justify-center
            rounded-xl
            border
            border-dashed
            border-white/10
            bg-black/20
            text-center
          "
        >
          <div
            className="
              mb-3
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-yellow-400/20
              bg-yellow-400/10
              text-yellow-400
            "
          >
            ●
          </div>

          <p className="font-medium text-white">
            No Recent Activity
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Your latest trading events will appear here.
          </p>
        </div>
      ) : (
        <div className="relative space-y-6">
          {activities.map((activity) => (
  <div
    key={activity.id}
    className="
      relative
      pl-8
      pb-2
      border-l
      border-yellow-400/30
    "
  >
    <div
      className="
        absolute
        -left-[7px]
        top-1
        h-3
        w-3
        rounded-full
        border
        border-yellow-300
        bg-yellow-400
        shadow-[0_0_10px_rgba(250,204,21,0.7)]
      "
    />

    <div
      className="
        rounded-xl
        border
        border-white/5
        bg-white/[0.03]
        p-4
        transition-all
        duration-300
        hover:border-yellow-400/20
        hover:bg-white/[0.05]
      "
    >
      <h3 className="font-semibold text-yellow-400">
        {
          (activity as any).title ??
          (activity as any).action ??
          "Activity"
        }
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-gray-300">
        {
          (activity as any).description ??
          (activity as any).message ??
          ""
        }
      </p>

      <div className="mt-3 text-xs text-gray-500">
        {new Date(
          (activity as any).timestamp ??
          (activity as any).created_at
        ).toLocaleString()}
      </div>
    </div>
  </div>
))}
        </div>
      )}
    </section>
  );
};

export default ActivityTimeline;