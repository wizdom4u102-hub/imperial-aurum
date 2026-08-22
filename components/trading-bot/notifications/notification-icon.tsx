"use client";

import React from "react";

import {

  Bell,

  CheckCircle2,

  AlertTriangle,

  Info,

  CircleDollarSign,

  CandlestickChart,

  Wallet,

  XCircle,

} from "lucide-react";

interface NotificationIconProps {

  type:
    | "success"
    | "warning"
    | "info"
    | "error"
    | "profit"
    | "trade"
    | "deposit";

  customIcon?: React.ReactNode;

}

const NotificationIcon: React.FC<
  NotificationIconProps
> = ({
  type,
  customIcon,
}) => {

  if (customIcon) {

    return (

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">

        {customIcon}

      </div>

    );

  }

  const icons = {

    success: <CheckCircle2 className="text-green-500" size={20} />,

    warning: <AlertTriangle className="text-yellow-500" size={20} />,

    info: <Info className="text-blue-500" size={20} />,

    error: <XCircle className="text-red-500" size={20} />,

    profit: <CircleDollarSign className="text-green-400" size={20} />,

    trade: <CandlestickChart className="text-purple-500" size={20} />,

    deposit: <Wallet className="text-cyan-400" size={20} />,

  };

  return (

    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">

      {icons[type] ?? <Bell size={20} className="text-white" />}

    </div>

  );

};

export default NotificationIcon;