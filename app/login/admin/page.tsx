import { loginAction } from '@/actions/auth'

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-zinc-900 p-10 rounded-3xl w-full max-w-md border border-yellow-500">

        <h1 className="text-3xl font-bold text-yellow-400 mb-6">
          Admin Login
        </h1>

        <p className="text-zinc-400 mb-6">
          Imperial Aurum Admin Access
        </p>

        <form action={loginAction}>
          <input
            name="email"
            type="email"
            required
            placeholder="Admin Email"
            className="w-full p-4 mb-4 rounded-xl bg-zinc-800"
          />

          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full p-4 mb-6 rounded-xl bg-zinc-800"
          />

          <button
            type="submit"
            className="w-full p-4 rounded-xl bg-yellow-400 text-black font-bold hover:bg-yellow-500"
          >
            Login
          </button>
        </form>

      </div>
    </div>
  )
}