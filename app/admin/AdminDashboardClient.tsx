'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type User = {
  id: string;
  name?: string | null;
  email: string;
  status: string;
  verified: boolean;
  created_at?: string | null;
};

export default function AdminDashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') || 'all';

  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/admin/users', {
        cache: 'no-store',
        credentials: 'include',
      });

      const text = await res.text();

      if (!res.ok) {
        console.error('❌ API ERROR:', text);
        setUsers([]);
        setError(`Server error (${res.status})`);
        return;
      }

      const data = JSON.parse(text);

      if (!Array.isArray(data.users)) {
        console.error('❌ Invalid users format:', data);
        setUsers([]);
        setError('Invalid data format');
        return;
      }

      // Filter logic
      let filtered = [...data.users];

      if (filter === 'verified') {
        filtered = filtered.filter((u) => Boolean(u.verified));
      } else if (filter === 'unverified') {
        filtered = filtered.filter((u) => !Boolean(u.verified));
      } else if (filter === 'active') {
        filtered = filtered.filter((u) => u.status === 'active');
      } else if (filter === 'blocked') {
        filtered = filtered.filter((u) => u.status !== 'active');
      }

      setUsers(filtered);
    } catch (err: any) {
      console.error('❌ Fetch users error:', err);
      setUsers([]);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', {
        cache: 'no-store',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('❌ Stats fetch error:', err);
    }
  };

  // Fetch data when filter changes
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [filter]);

  const refresh = () => {
    fetchUsers();
    fetchStats();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-red-400 text-center">
          <p className="text-xl mb-4">⚠️ {error}</p>
          <button
            onClick={refresh}
            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-zinc-500 mt-2">
              Manage Users • {new Date().toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={refresh}
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl"
          >
            🔄 Refresh
          </button>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-900 p-6 rounded-2xl">
            <p className="text-zinc-400 text-sm">Total Users</p>
            <p className="text-3xl font-bold mt-2">{stats?.totalUsers ?? 0}</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-2xl">
            <p className="text-zinc-400 text-sm">Total Cash</p>
            <p className="text-3xl font-bold mt-2">${stats?.totalCash ?? 0}</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-2xl">
            <p className="text-zinc-400 text-sm">Wallet Balance</p>
            <p className="text-3xl font-bold mt-2">${stats?.totalWallet ?? 0}</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-2xl">
            <p className="text-zinc-400 text-sm">Total Shares</p>
            <p className="text-3xl font-bold mt-2">{stats?.totalShares ?? 0}</p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 mb-6 border-b border-zinc-800 pb-4">
          {['all', 'active', 'blocked', 'verified', 'unverified'].map((f) => (
            <button
              key={f}
              onClick={() => router.push(`/admin?filter=${f}`)}
              className={`px-5 py-2 rounded-xl text-sm ${
                filter === f
                  ? 'bg-white text-black'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
          <table className="w-full">
            <thead className="bg-zinc-950">
              <tr>
                <th className="px-6 py-5 text-left text-zinc-400">Name</th>
                <th className="px-6 py-5 text-left text-zinc-400">Email</th>
                <th className="px-6 py-5 text-left text-zinc-400">Status</th>
                <th className="px-6 py-5 text-left text-zinc-400">Verified</th>
                <th className="px-6 py-5 text-left text-zinc-400">Joined</th>
                <th className="w-24"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-zinc-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-950/50">
                    <td className="px-6 py-5">{user.name || '—'}</td>
                    <td className="px-6 py-5 text-zinc-300">{user.email}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {user.status === 'active' ? '🟢 Active' : '🔴 Blocked'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.verified
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {user.verified ? '✅ Verified' : '❌ Not Verified'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-zinc-500">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                        className="text-yellow-400 hover:text-yellow-300 px-4 py-2 rounded-xl hover:bg-zinc-800"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}