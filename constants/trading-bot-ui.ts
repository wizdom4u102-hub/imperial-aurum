export const TRADING_BOT_ACTION_LABELS = {
  activateBot: 'Activate Bot',
  viewTrades: 'View Trades',
  viewHistory: 'View History',
  contactSupport: 'Contact Support',
  deposit: 'Deposit',
} as const;

export const ACTIVATION_WIZARD_LABELS = {
  reviewBot: 'Review Bot',
  chooseAmount: 'Choose Amount',
  confirmActivation: 'Confirm Activation',
} as const;

export const EMPTY_STATE_CONTENT = {
  noActiveBots: {
    title: 'No Active Trading Bots',
    description: 'You haven’t activated any trading bot yet.',
  },
  noTrades: {
    title: 'No Trading Activity Yet',
    description: 'Trades will appear after a bot starts operating.',
  },
  noNotifications: {
    title: 'No Recent Notifications',
    description: 'Your notifications will appear here.',
  },
} as const;

export const LOADING_MESSAGES = {
  loadingDashboard: 'Loading dashboard...',
  loadingBots: 'Loading bots...',
  loadingTrades: 'Loading trades...',
  loadingNotifications: 'Loading notifications...'
} as const;