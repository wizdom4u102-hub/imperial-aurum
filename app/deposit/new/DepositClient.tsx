'use client';

import { useState } from 'react';

export default function DepositClient({ methods }: any) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');

  return (
    <div>

      {/* 💰 AMOUNT INPUT */}
      <div className="bg-zinc-900 p-6 rounded-2xl mb-8">
        <label className="text-sm text-zinc-400">Deposit Amount</label>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full mt-2 p-3 bg-zinc-800 rounded-lg outline-none"
        />
      </div>

      {/* WALLET METHODS */}
      {methods && methods.length > 0 ? (
        <div className="space-y-6">

          {methods.map((m: any) => (
            <div
              key={m.id}
              className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800"
            >

              {/* METHOD INFO */}
              <h2 className="text-xl font-bold">{m.name}</h2>
              <p className="text-zinc-400">{m.type}</p>

              {/* WALLET DETAILS */}
              <div className="mt-3 bg-zinc-800 p-3 rounded-lg text-sm break-all text-zinc-300">
                {typeof m.details === 'object'
                  ? JSON.stringify(m.details)
                  : m.details}
              </div>

              {/* COPY BUTTON */}
              <button
                onClick={() => {
                  const text =
                    typeof m.details === 'object'
                      ? JSON.stringify(m.details)
                      : String(m.details);

                  navigator.clipboard.writeText(text);
                  alert('Wallet copied!');
                }}
                className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold"
              >
                Copy Wallet
              </button>

              {/* SELECT WALLET BUTTON */}
              <button
                onClick={() => setSelectedMethod(m.id)}
                className={`mt-3 ml-3 px-4 py-2 rounded-lg font-semibold ${
                  selectedMethod === m.id
                    ? 'bg-green-500 text-black'
                    : 'bg-zinc-700 text-white'
                }`}
              >
                {selectedMethod === m.id ? 'Selected' : 'Select'}
              </button>

            </div>
          ))}

          {/* SUBMIT DEPOSIT BUTTON */}
          <button
            disabled={!amount || !selectedMethod || loading}
            onClick={async () => {
              setLoading(true);

              const res = await fetch('/api/deposit/create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  amount: Number(amount),
                  method_id: selectedMethod,
                }),
              });

              const data = await res.json();

              setLoading(false);

              if (data.success) {
                alert('Deposit submitted successfully');

                setAmount('');
                setSelectedMethod('');
              } else {
                alert(data.error || 'Failed to submit deposit');
              }
            }}
            className="w-full mt-10 bg-green-500 text-black py-3 rounded-xl font-bold disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Submit Deposit'}
          </button>

        </div>
      ) : (
        <div className="bg-zinc-900 p-10 text-center rounded-3xl">
          <p className="text-zinc-400">
            No payment methods available yet.
          </p>
        </div>
      )}

    </div>
  );
}