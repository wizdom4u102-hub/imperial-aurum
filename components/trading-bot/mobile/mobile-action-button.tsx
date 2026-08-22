import React from "react";

import { Button } from "@/components/ui/button";

interface MobileActionButtonProps {
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  active?: boolean;
}

const MobileActionButton: React.FC<MobileActionButtonProps> = ({
  icon,
  label,
  onClick,
  disabled,
  loading,
  active,
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center justify-center w-full p-4 rounded-lg transition ${
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-200"
      } hover:bg-gray-300`}
      aria-label={label}
    >
      {icon && (
        <div className="mr-2">
          {icon}
        </div>
      )}

      <span>
        {loading ? "Loading..." : label}
      </span>
    </Button>
  );
};

export default MobileActionButton;