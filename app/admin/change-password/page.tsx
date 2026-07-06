import { changePasswordAction } from "@/actions/auth";

export default async function AdminChangePasswordPage({
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
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
        <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400">
          Admin Change Password
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-6 bg-red-950/50 p-3 rounded-lg">
            {error}
          </p>
        )}

        {message && (
          <p className="text-green-500 text-center mb-6 bg-green-950/50 p-3 rounded-lg">
            {message}
          </p>
        )}

        <form action={changePasswordAction} className="space-y-6">
          {/* Tell the server action this is an ADMIN page */}
          <input
            type="hidden"
            name="redirect_base"
            value="admin"
          />

          <div>
            <label className="block text-sm mb-2 text-zinc-400">
              Current Password
            </label>

            <input
              name="current_password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-zinc-400">
              New Password
            </label>

            <input
              name="new_password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-zinc-400">
              Confirm New Password
            </label>

            <input
              name="confirm_password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-4 rounded-xl font-bold transition-colors"
          >
            Update Password
          </button>
        </form>

        <div className="text-center mt-6">
          <a
            href="/admin/dashboard"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            ← Back to Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}