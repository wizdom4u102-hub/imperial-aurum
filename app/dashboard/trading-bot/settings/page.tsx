"use client";

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import DashboardLayout from "@/components/trading-bot/dashboard-layout";
import DashboardHeader from "@/components/trading-bot/dashboard-header";
import SettingsForm from "@/components/trading-bot/settings/settings-form";

interface TradingBotSettings {
  id: string;

  auto_reinvest: boolean;

  auto_renew: boolean;

  email_notifications: boolean;

  notifications_enabled: boolean;

  preferred_currency: string;

  push_notifications: boolean;

  risk_level: string;

  timezone: string;
}

interface SettingsResponse {
  data: TradingBotSettings;

  error: string | null;
}

export default function TradingBotSettingsPage() {
  const [
    settings,
    setSettings,
  ] =
    useState<TradingBotSettings | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const [
    lastUpdated,
    setLastUpdated,
  ] =
    useState("");

  const fetchSettings =
    useCallback(
      async () => {
        try {
          setLoading(true);

          setError(null);

          const response =
            await fetch(
              "/api/trading-bot/settings",
              {
                cache:
                  "no-store",
              }
            );

          const result: SettingsResponse =
            await response.json();

          if (
            !response.ok ||
            result.error
          ) {
            throw new Error(
              result.error ??
                "Unable to load settings."
            );
          }

          setSettings(
            result.data
          );

          setLastUpdated(
            new Date().toLocaleString()
          );
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load settings."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <DashboardHeader
          loading={loading}
          onRefresh={
            fetchSettings
          }
          lastUpdated={
            lastUpdated
          }
          onActivateBot={() => {
            window.location.href =
              "/dashboard/trading-bot/marketplace";
          }}
        />

        {error && (
          <div
            className="
              rounded-2xl
              border
              border-red-500/30
              bg-red-500/10
              p-6
              text-center
              text-red-400
            "
          >
            {error}
          </div>
        )}

        {!loading &&
          settings && (
            <SettingsForm
              settings={
                settings
              }
              onSaved={
                setSettings
              }
            />
          )}

      </div>
    </DashboardLayout>
  );
}