import React, { ChangeEvent } from 'react';

interface DepositAmountInputProps {
  value: number | string;
  onChange: (amount: number) => void;
  currency: string;
  minAmount: number;
  disabled?: boolean;
  error?: string;
  helperText?: string;
}

const DepositAmountInput: React.FC<DepositAmountInputProps> = ({
  value,
  onChange,
  currency,
  minAmount,
  disabled = false,
  error,
  helperText,
}) => {
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    if (!isNaN(amount) && amount >= minAmount) {
      onChange(amount);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1">Amount</label>
      <input
        type="number"
        value={value}
        onChange={handleAmountChange}
        disabled={disabled}
        className={`w-full border rounded p-2 ${error ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500`}
        placeholder="Enter amount"
      />
      {helperText && <p className="text-sm text-gray-500 mt-1">{helperText}</p>}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      <p className="text-sm text-gray-500 mt-1">Currency: {currency}</p>
      <p className="text-sm text-gray-500 mt-1">Minimum Amount: ${minAmount}</p>
    </div>
  );
};

export default DepositAmountInput;