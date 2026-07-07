'use client';

import Link from "next/link";
import { loginAction } from '../../actions/auth';   // Make sure this path is correct
// Remove or comment out signupAction if it's not needed here

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-yellow-400">Imperial Aurum</h1>
          <p className="text-zinc-400 mt-3">Sign in to your account</p>
        </div>

        <form action={loginAction} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-zinc-400">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-yellow-400 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-zinc-400">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-yellow-400 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-black font-semibold py-4 rounded-2xl transition-colors mt-4"
          >
            Login
          </button>
        </form>

        <Link
  href="/forgot-password"
  className="text-sm text-yellow-400 hover:text-yellow-300"
>
  Forgot Password?
</Link>

        <div className="text-center mt-8 text-sm text-zinc-500">
          Don't have an account?{' '}
          <a href="/signup" className="text-yellow-400 hover:text-yellow-300">
            Sign up here
          </a>
        </div>
      </div>
    </div>
  );
}