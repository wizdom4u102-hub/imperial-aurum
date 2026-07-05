'use client';

export default function SendEmailPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Send Email to Users</h1>
        <p className="text-zinc-500 mt-2">Broadcast email or send to specific users</p>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800">
        <form className="space-y-6">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Subject</label>
            <input 
              type="text" 
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-yellow-400" 
              placeholder="Important update from Imperial Aurum" 
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Message</label>
            <textarea 
              rows={12}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-5 py-4 text-white focus:outline-none focus:border-yellow-400"
              placeholder="Dear user, ..."
            />
          </div>

          <div className="flex gap-4">
            <button 
              type="button"
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-2xl transition"
            >
              Send to All Users
            </button>
            <button 
              type="submit"
              className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-semibold py-3 rounded-2xl transition"
            >
              Send Email
            </button>
          </div>
        </form>
      </div>

      <p className="text-xs text-zinc-500 text-center">
        Note: Email functionality will be connected to Supabase Edge Functions or Resend later.
      </p>
    </div>
  );
}