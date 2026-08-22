export const BOT_STATUS_LABELS = {
  active: { label: 'Active', description: 'The bot is currently active and trading.' },
  pending: { label: 'Pending', description: 'The bot is awaiting activation.' },
  paused: { label: 'Paused', description: 'The bot is currently paused and not trading.' },
  expired: { label: 'Expired', description: 'The bot activation period has expired.' },
  completed: { label: 'Completed', description: 'The bot has completed its trading period.' },
  failed: { label: 'Failed', description: 'The bot has encountered an error.' },
} as const;

export const STATUS_BADGE_CONFIG = {
  active: { label: 'Active', icon: 'icon-active', displayType: 'success' },
  pending: { label: 'Pending', icon: 'icon-pending', displayType: 'warning' },
  paused: { label: 'Paused', icon: 'icon-paused', displayType: 'neutral' },
  expired: { label: 'Expired', icon: 'icon-expired', displayType: 'danger' },
  completed: { label: 'Completed', icon: 'icon-completed', displayType: 'info' },
  failed: { label: 'Failed', icon: 'icon-failed', displayType: 'error' },
} as const;

export const NOTIFICATION_TYPES = ['success', 'warning', 'info', 'error', 'profit', 'trade', 'deposit'] as const;