"use client";

import React, {
  useState,
} from "react";

import { Button } from "@/components/ui/button";

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

interface SettingsFormProps {
  settings: TradingBotSettings;

  onSaved?: (
    settings: TradingBotSettings
  ) => void;
}

const SettingsForm: React.FC<
  SettingsFormProps
> = ({
  settings,
  onSaved,
}) => {
  const [
    form,
    setForm,
  ] = useState(settings);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const updateField = <
    K extends keyof TradingBotSettings
  >(
    key: K,
    value: TradingBotSettings[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  async function saveSettings() {
    try {
      setSaving(true);

      setMessage("");

      const response =
        await fetch(
          "/api/trading-bot/settings",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(form),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        result.error
      ) {
        throw new Error(
          result.error ??
            "Unable to save settings."
        );
      }

      setForm(result.data);

      onSaved?.(
        result.data
      );

      setMessage(
        "Settings updated successfully."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      className="
        rounded-2xl
        border
        border-white/10
        bg-[#0b1020]/80
        backdrop-blur-xl
        p-6
        shadow-xl
      "
    >
      <h2
        className="
          mb-6
          text-xl
          font-bold
          text-white
        "
      >
        Trading Bot Settings
      </h2>

      <div className="space-y-6">

        <label className="flex items-center justify-between">

          <span className="text-gray-300">
            Auto Renew
          </span>

          <input
            type="checkbox"
            checked={
              form.auto_renew
            }
            onChange={(event) =>
              updateField(
                "auto_renew",
                event.target.checked
              )
            }
          />

        </label>

        <label className="flex items-center justify-between">

          <span className="text-gray-300">
            Auto Reinvest
          </span>

          <input
            type="checkbox"
            checked={
              form.auto_reinvest
            }
            onChange={(event) =>
              updateField(
                "auto_reinvest",
                event.target.checked
              )
            }
          />

        </label>

        <label className="flex items-center justify-between">

          <span className="text-gray-300">
            Notifications
          </span>

          <input
            type="checkbox"
            checked={
              form.notifications_enabled
            }
            onChange={(event) =>
              updateField(
                "notifications_enabled",
                event.target.checked
              )
            }
          />

        </label>

        <label className="flex items-center justify-between">

          <span className="text-gray-300">
            Email Notifications
          </span>

          <input
            type="checkbox"
            checked={
              form.email_notifications
            }
            onChange={(event) =>
              updateField(
                "email_notifications",
                event.target.checked
              )
            }
          />

        </label>

        <label className="flex items-center justify-between">

          <span className="text-gray-300">
            Push Notifications
          </span>

          <input
            type="checkbox"
            checked={
              form.push_notifications
            }
            onChange={(event) =>
              updateField(
                "push_notifications",
                event.target.checked
              )
            }
          />

        </label>

        <div>

          <label
            className="
              mb-2
              block
              text-sm
              text-gray-300
            "
          >
            Risk Level
          </label>

          <select
            value={
              form.risk_level
            }
            onChange={(event) =>
              updateField(
                "risk_level",
                event.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-[#111827]
              p-3
              text-white
            "
          >
            <option value="Low">
              Low
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="High">
              High
            </option>
          </select>

        </div>

        <div>

          <label
            className="
              mb-2
              block
              text-sm
              text-gray-300
            "
          >
            Preferred Currency
          </label>

          <input
            value={
              form.preferred_currency
            }
            onChange={(event) =>
              updateField(
                "preferred_currency",
                event.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-[#111827]
              p-3
              text-white
            "
          />

        </div>

        <div>

          <label
            className="
              mb-2
              block
              text-sm
              text-gray-300
            "
          >
            Timezone
          </label>

          <input
            value={
              form.timezone
            }
            onChange={(event) =>
              updateField(
                "timezone",
                event.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-[#111827]
              p-3
              text-white
            "
          />

        </div>

        {message && (
          <div
            className="
              rounded-xl
              bg-white/5
              p-3
              text-sm
              text-gray-300
            "
          >
            {message}
          </div>
        )}

        <Button
          onClick={
            saveSettings
          }
          disabled={
            saving
          }
          className="
            w-full
            bg-gradient-to-r
            from-yellow-500
            to-amber-600
            text-black
            font-semibold
          "
        >
          {saving
            ? "Saving..."
            : "Save Settings"}
        </Button>

      </div>
    </section>
  );
};

export default SettingsForm;