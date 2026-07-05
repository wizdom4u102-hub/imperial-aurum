'use client'

export default function ReferralLink({ referralCode }: { referralCode: string }) {
  const referralLink =
  typeof window !== 'undefined'
    ? `${window.location.origin}/signup?ref=${referralCode}`
    : ''

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      alert('✅ Referral link copied to clipboard!')
    } catch (err) {
      alert('Failed to copy. Please copy manually.')
    }
  }

  return (
    <div className="bg-zinc-800 p-6 rounded-2xl">
      <p className="text-xs text-zinc-400 mb-3">Your Referral Link</p>
      <div className="flex gap-3">
        <input 
          type="text" 
          readOnly 
          value={referralLink} 
          className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm font-mono text-white overflow-hidden"
        />
        <button 
          onClick={copyLink}
          className="bg-yellow-500 hover:bg-yellow-600 px-8 rounded-xl font-medium text-black whitespace-nowrap"
        >
          Copy
        </button>
      </div>
    </div>
  )
}