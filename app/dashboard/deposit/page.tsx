import { createClient } from '@/lib/supabase/server'


export default async function DepositPage() {
  const supabase = await createClient()

  const { data: methods } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('is_active', true)

  return (
    <div className="p-4 md:p-4 md:p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Make Deposit</h1>

      {methods && methods.length > 0 ? (
        methods.map((method) => (
          <div key={method.id} className="bg-zinc-900 p-6 rounded-2xl mb-6">

            {/* METHOD NAME */}
            <h2 className="text-xl font-semibold mb-2">
              {method.name}
            </h2>

            <p className="text-zinc-400 mb-4">
              Type: {method.type}
            </p>

            {/* WALLET / DETAILS */}
            <div className="bg-zinc-800 p-4 rounded-xl mb-4">
              <p className="text-sm text-zinc-400 mb-2">
                Payment Details:
              </p>

              <pre className="text-xs text-green-400 whitespace-pre-wrap">
                {JSON.stringify(method.details, null, 2)}
              </pre>
            </div>

           

          </div>
        ))
      ) : (
        <p className="text-zinc-400 text-center py-10 md:py-20">
          No payment methods available
        </p>
      )}
    </div>
  )
}