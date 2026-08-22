import React from "react";

import MobileActionButton from "./mobile-action-button";
import MobileActionBarSpacer from "./mobile-action-bar-spacer";

interface Action {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

interface MobileBottomActionBarProps {
  actions: Action[];
}

const MobileBottomActionBar: React.FC<
  MobileBottomActionBarProps
> = ({
  actions,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-2 space-y-2 md:space-y-0 md:space-x-2 md:flex md:justify-around md:mb-6">
      {actions.map((action) => (
        <MobileActionButton
          key={action.id}
          label={action.label}
          icon={action.icon}
          onClick={action.onClick}
          disabled={action.disabled}
          loading={action.loading}
          active={action.label === "Activate Bot"}
        />
      ))}

      <MobileActionBarSpacer />
    </div>
  );
};

export default MobileBottomActionBar;