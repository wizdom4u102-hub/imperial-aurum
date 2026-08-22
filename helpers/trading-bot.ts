export function formatBotStatus(status: string): string {
  const statusMap: { [key: string]: string } = {
    active: 'Active',
    pending: 'Pending',
    paused: 'Paused',
    expired: 'Expired',
    completed: 'Completed',
    failed: 'Failed',
  };
  return statusMap[status] || 'Unknown';
}

export function formatRiskLevel(riskLevel: string): string {
  const riskMap: { [key: string]: string } = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
  };
  return riskMap[riskLevel] || 'Unknown Risk';
}

export function getStatusDisplayType(status: string): 'success' | 'warning' | 'error' | 'neutral' {
  const statusDisplayMap: { [key: string]: 'success' | 'warning' | 'error' | 'neutral' } = {
    active: 'success',
    pending: 'warning',
    paused: 'neutral',
    expired: 'error',
    completed: 'success',
    failed: 'error',
  };
  return statusDisplayMap[status] || 'neutral';
}

export function getBotStrategyLabel(strategy: string): string {
  return strategy.charAt(0).toUpperCase() + strategy.slice(1);
}