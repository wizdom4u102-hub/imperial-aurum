import { resetPasswordAction } from "@/actions/auth";

export default async function ResetPasswordPage({
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
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-yellow-400 mb-8">
          Reset Password
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

        <form action={resetPasswordAction} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm text-zinc-400">
              New Password
            </label>

            <input
              type="password"
              name="new_password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-zinc-400">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirm_password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-yellow-500 py-4 font-bold text-black transition hover:bg-yellow-600"
          >
            Reset Password
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-zinc-400 hover:text-white"
          >
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}