import { forgotPasswordAction } from "@/actions/auth";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
}) {
  const { message, error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="mb-8 text-center text-3xl font-bold text-yellow-400">
          Forgot Password
        </h1>

        {error && (
          <div className="mb-6 rounded-lg bg-red-950/50 p-3 text-center text-red-400">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-lg bg-green-950/50 p-3 text-center text-green-400">
            {message}
          </div>
        )}

        <p className="mb-6 text-center text-sm text-zinc-400">
          Enter the email address associated with your account and we'll send
          you a password reset link.
        </p>

        <form action={forgotPasswordAction} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-yellow-500 py-4 font-bold text-black transition hover:bg-yellow-600"
          >
            Send Reset Link
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-zinc-400 transition hover:text-white"
          >
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}