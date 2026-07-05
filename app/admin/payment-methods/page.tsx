export const dynamic = 'force-dynamic'
export const revalidate = 0

import { requireAdminPage } from '@/lib/admin'
import { supabaseAdmin } from '@/lib/supabase/admin'

import {
  addPaymentMethod,
  deletePaymentMethod,
  togglePaymentMethod,
} from '@/actions/payment-methods'

export default async function PaymentMethodsPage() {
  await requireAdminPage()

  const supabase = supabaseAdmin

  // ===============================
  // FETCH PAYMENT METHODS
  // ===============================
  const { data: methods, error } = await supabase
    .from('payment_methods')
    .select('*')
    .order('created_at', { ascending: false })

  // ===============================
  // DEBUG LOGS (IMPORTANT)
  // ===============================
  console.log('================ PAYMENT METHODS DEBUG ================')
  console.log('ERROR:', error)
  console.log('RAW METHODS:', methods)
  console.log('COUNT:', methods?.length || 0)

  if (error) {
    console.error('❌ PAYMENT METHODS FETCH FAILED:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })

    throw new Error(error.message)
  }

  // ===============================
  // NORMALIZE DATA (PREVENT UI ISSUES)
  // ===============================
  const normalizedMethods =
    methods?.map((m) => ({
      ...m,

      // fix broken type values (you had invalid data in DB)
      type:
        m.type === 'crypto' ||
        m.type === 'bank' ||
        m.type === 'wallet'
          ? m.type
          : 'crypto',

      // ensure details always render safely
      details:
        typeof m.details === 'object'
          ? JSON.stringify(m.details, null, 2)
          : String(m.details || ''),
    })) || []

  // ===============================
  // UI
  // ===============================
  console.log('FINAL RENDER LIST:', normalizedMethods)
  
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold text-yellow-400 mb-10">
          Payment Methods
        </h1>

        {/* ADD PAYMENT METHOD */}
        <form
          action={addPaymentMethod}
          className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl mb-10 space-y-5"
        >
          <h2 className="text-2xl font-bold text-yellow-400">
            Add Payment Method
          </h2>

          <div>
            <label className="block mb-2 text-zinc-400">
              Payment Name
            </label>

            <input
              name="name"
              required
              placeholder="Bitcoin"
              className="w-full p-4 bg-zinc-800 rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-2 text-zinc-400">
              Payment Type
            </label>

            <select
              name="type"
              required
              className="w-full p-4 bg-zinc-800 rounded-xl"
            >
              <option value="crypto">Cryptocurrency</option>
              <option value="bank">Bank Transfer</option>
              <option value="wallet">E-Wallet</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-zinc-400">
              Wallet Address / Account Details
            </label>

            <textarea
              name="details"
              required
              rows={6}
              placeholder="Paste wallet address or bank details here..."
              className="w-full p-4 bg-zinc-800 rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl"
          >
            Add Payment Method
          </button>
        </form>

        {/* METHODS */}
        <div className="space-y-6">

          {/* DEBUG UI INFO */}
          <div className="mb-6 bg-zinc-800 p-4 rounded-xl">
            <p className="text-green-400 font-bold">
              Methods Found: {normalizedMethods.length}
            </p>

            <p className="text-xs text-zinc-400 mt-2">
              Check server logs if this number looks wrong
            </p>
          </div>

          {/* EMPTY STATE */}
          {normalizedMethods.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
              <p className="text-zinc-400">
                No payment methods found.
              </p>
            </div>
          ) : (
            normalizedMethods.map((m) => (
              <div
                key={m.id}
                className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start mb-4">

                  <div>
                    <h2 className="text-2xl font-bold text-yellow-400">
                      {m.name}
                    </h2>

                    <p className="text-zinc-400 mt-1">
                      {m.type}
                    </p>
                  </div>

                  {m.is_active ? (
                    <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl">
                      Active
                    </span>
                  ) : (
                    <span className="bg-red-500/20 text-red-400 px-4 py-2 rounded-xl">
                      Disabled
                    </span>
                  )}
                </div>

                {/* DETAILS */}
                <div className="bg-zinc-800 p-4 rounded-2xl">
                  <p className="text-zinc-400 text-xs mb-2">
                    Wallet Address / Payment Details
                  </p>

                  <pre className="whitespace-pre-wrap break-all text-sm">
                    {m.details}
                  </pre>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-4 mt-6">

                  <form
                    action={togglePaymentMethod.bind(
                      null,
                      m.id,
                      m.is_active
                    )}
                  >
                    <button
                      type="submit"
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded-xl font-semibold"
                    >
                      {m.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </form>

                  <form
                    action={deletePaymentMethod.bind(null, m.id)}
                  >
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl font-semibold"
                    >
                      Delete
                    </button>
                  </form>

                </div>
              </div>
            ))
          )}

        </div>

      </div>
    </div>
  )
}