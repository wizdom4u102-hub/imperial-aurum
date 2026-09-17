"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  KeyRound,
  Link2,
  Loader2,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

interface Profile {
  id: string;
  username: string | null;
  email: string | null;
}

export default function ProfilePage() {
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [referralLink, setReferralLink] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setError("Unable to load your account.");
          return;
        }

        const {
          data,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("id, username, email")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error(
            "Profile loading error:",
            profileError
          );

          setError("Unable to load your profile.");
          return;
        }

        if (!data) {
          setError("Profile information could not be found.");
          return;
        }

        const profileData: Profile = {
          id: data.id,
          username: data.username,
          email: data.email,
        };

        setProfile(profileData);
        setEmail(data.email ?? "");

        if (data.username) {
          setReferralLink(
            `${window.location.origin}/register?ref=${encodeURIComponent(
              data.username
            )}`
          );
        }
      } catch (error) {
        console.error(
          "Profile loading error:",
          error
        );

        setError(
          "An unexpected error occurred while loading your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [supabase]);

  const handleEmailUpdate = async () => {
    if (!profile) {
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Please enter an email address.");
      setMessage("");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "/api/profile/email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: trimmedEmail,
          }),
        }
      );

      const data = (await response.json()) as {
        success?: boolean;
        emailUpdated?: boolean;
        notificationSent?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok || !data.success) {
        setError(
          data.error ||
            "Unable to update your email address."
        );

        return;
      }

      setProfile((current) =>
        current
          ? {
              ...current,
              email: trimmedEmail,
            }
          : current
      );

      setEmail(trimmedEmail);

      setMessage(
        data.message ||
          "Your email address has been changed successfully."
      );
    } catch (error) {
      console.error(
        "Email update request error:",
        error
      );

      setError(
        "Unable to update your email address. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCopyReferralLink = async () => {
    if (!referralLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        referralLink
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Referral link copy error:",
        error
      );

      setError(
        "Unable to copy the referral link."
      );
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />

            <p className="text-sm text-zinc-400">
              Loading your profile...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/dashboard"
            className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-yellow-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
            <p className="text-sm text-red-400">
              {error ||
                "Unable to load your profile."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Back */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-yellow-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/10">
              <User className="h-5 w-5 text-yellow-400" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                My Profile
              </h1>

              <p className="mt-1 text-sm text-zinc-400">
                Manage your account information and
                referral link.
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
            <p className="text-sm text-red-400">
              {error}
            </p>
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <div className="flex items-start gap-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

              <p className="text-sm text-emerald-400">
                {message}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Account Information */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl shadow-black/20 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Account Information
                </h2>

                <p className="text-xs text-zinc-500">
                  Your basic account details
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Username
                </label>

                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

                  <input
                    id="username"
                    type="text"
                    value={profile.username ?? ""}
                    disabled
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 py-3 pl-10 pr-4 text-sm text-zinc-400 outline-none"
                  />
                </div>

                <p className="mt-2 text-xs text-zinc-600">
                  Your username cannot be changed.
                </p>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    disabled={saving}
                    autoComplete="email"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="Enter your email address"
                  />
                </div>

                <p className="mt-2 text-xs text-zinc-600">
                  Changing your email will send security
                  notifications to your old and new email
                  addresses.
                </p>
              </div>
            </div>

            {/* Save Email */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => void handleEmailUpdate()}
                disabled={
                  saving ||
                  email.trim().toLowerCase() ===
                    (profile.email ?? "")
                      .trim()
                      .toLowerCase()
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 text-sm font-semibold text-yellow-400 transition hover:border-yellow-400/50 hover:bg-yellow-500/15 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Email
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Referral Link */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl shadow-black/20 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-yellow-500/20 bg-yellow-500/10">
                <Link2 className="h-5 w-5 text-yellow-400" />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Referral Link
                </h2>

                <p className="text-xs text-zinc-500">
                  Share your referral link with others
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-black/60 p-3 sm:p-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="min-w-0 flex-1">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-3 text-xs text-zinc-300 outline-none sm:text-sm"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    void handleCopyReferralLink()
                  }
                  disabled={!referralLink}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-400 transition hover:border-cyan-400/50 hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <p className="mt-3 text-xs leading-5 text-zinc-600">
                Your referral link uses your username and
                can be shared with people you invite to
                Imperial Aurum Mining.
              </p>
            </div>
          </section>

          {/* Security */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl shadow-black/20 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10">
                <LockKeyhole className="h-5 w-5 text-purple-400" />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Security
                </h2>

                <p className="text-xs text-zinc-500">
                  Keep your account secure
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-black/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />

                <div>
                  <h3 className="text-sm font-medium text-white">
                    Change Password
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Update your password to keep your
                    account protected.
                  </p>
                </div>
              </div>

              <Link
                href="/change-password"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-yellow-500/40 hover:text-yellow-400"
              >
                <KeyRound className="h-4 w-4" />
                Change Password
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}