import { signupAction } from '@/actions/auth';
import Link from 'next/link';

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string
    message?: string
    ref?: string
  }>
}) 
{
  const {
  error,
  message,
  ref,
} = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
        <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-6 bg-red-950/50 p-3 rounded">
            {error}
          </p>
        )}
        {message && (
          <p className="text-green-500 text-center mb-6 bg-green-950/50 p-3 rounded">
            {message}
          </p>
        )}

        <form action={signupAction} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-zinc-400">Email</label>
            <input
              name="referral_code"
              type="text"
              defaultValue={ref || ''}
              readOnly={!!ref}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-zinc-400">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-zinc-400">
              Referral Code (optional)
            </label>
            <input
              name="referral_code"
              type="text"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-4 rounded-xl font-bold"
          >
            Create Account & Get 1000 Gold
          </button>
        </form>

        <p className="text-center mt-6 text-zinc-400">
          Already have an account?{' '}
          <Link href="/login" className="text-yellow-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}