"use client";

import { useEffect, useState } from "react";

const FIELDS = [
  ["primaryColor", "Primary color"],
  ["secondaryColor", "Secondary color"],
  ["accentColor", "Accent color"],
  ["backgroundColor", "Background color"],
  ["surfaceColor", "Surface color"],
  ["textColor", "Text color"],
  ["mutedTextColor", "Muted text"],
  ["borderColor", "Border color"],
];

const DEFAULTS = {
  storeName: "FIELDHOUSE",
  tagline: "Thoughtful living, beautifully made.",
  logo: null,
  favicon: null,
  primaryColor: "#1F3A2E",
  secondaryColor: "#B65C38",
  accentColor: "#B65C38",
  surfaceColor: "#F7F3EC",
  backgroundColor: "#F7F3EC",
  textColor: "#211F1D",
  mutedTextColor: "#8A8378",
  borderColor: "#E4DED2",
  successColor: "#1F3A2E",
  warningColor: "#C9A659",
  errorColor: "#B65C38",
  fontFamily: "League Spartan",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    fetch("/api/settings")
      .then(async (response) => {
        if (!response.ok)
          throw new Error(
            (await response.json()).message || "Unable to load settings",
          );
        return response.json();
      })
      .then((data) => setSettings({ ...DEFAULTS, ...data.settings }))
      .catch((error) => setStatus(error.message))
      .finally(() => setLoading(false));
  }, []);

  const update = (event) =>
    setSettings((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Unable to save settings");
      setSettings({ ...DEFAULTS, ...data.settings });
      setWarnings(data.warnings || []);
      setStatus(
        "Branding saved. The theme is now active across the application.",
      );
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="p-6 text-gray-500">Loading store settings...</div>;

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
          Storefront
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Brand settings
        </h1>
        <p className="mt-2 text-gray-600">
          Set the identity customers see across the storefront.
        </p>
      </div>

      <form
        onSubmit={save}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <label
          className="block text-sm font-semibold text-gray-700"
          htmlFor="storeName"
        >
          Store name
        </label>
        <input
          id="storeName"
          name="storeName"
          value={settings.storeName}
          onChange={update}
          maxLength={80}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
          required
        />

        <label
          className="mt-6 block text-sm font-semibold text-gray-700"
          htmlFor="tagline"
        >
          Tagline
        </label>
        <input
          id="tagline"
          name="tagline"
          value={settings.tagline || ""}
          onChange={update}
          maxLength={160}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {["logo", "favicon"].map((name) => (
            <label
              key={name}
              className="block text-sm font-semibold capitalize text-gray-700"
              htmlFor={`${name}Url`}
            >
              {name} URL
              <input
                id={`${name}Url`}
                value={settings[name]?.url || ""}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    [name]: {
                      ...(current[name] || {}),
                      url: event.target.value,
                    },
                  }))
                }
                placeholder="https://..."
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs"
                inputMode="url"
              />
            </label>
          ))}
        </div>

        <label
          className="mt-6 block text-sm font-semibold text-gray-700"
          htmlFor="fontFamily"
        >
          Storefront font
        </label>
        <select
          id="fontFamily"
          name="fontFamily"
          value={settings.fontFamily}
          onChange={update}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          {[
            "League Spartan",
            "Inter",
            "Lato",
            "Merriweather",
            "Poppins",
            "Playfair Display",
          ].map((font) => (
            <option key={font}>{font}</option>
          ))}
        </select>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {FIELDS.map(([name, label]) => (
            <label
              key={name}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-3 text-sm font-semibold text-gray-700"
            >
              {label}
              <span className="flex items-center gap-2">
                <input
                  type="color"
                  name={name}
                  value={settings[name]}
                  onChange={update}
                  aria-label={label}
                />
                <input
                  name={name}
                  value={settings[name]}
                  onChange={update}
                  className="w-24 rounded border border-gray-300 px-2 py-1 font-mono text-xs"
                  pattern="#[0-9A-Fa-f]{6}"
                />
              </span>
            </label>
          ))}
        </div>

        <div
          className="mt-6 rounded-xl border p-5"
          style={{
            background: settings.backgroundColor,
            color: settings.textColor,
            borderColor: settings.borderColor,
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.16em]"
            style={{ color: settings.mutedTextColor }}
          >
            Live preview
          </p>
          <h2 className="mt-2 text-xl font-bold">
            {settings.storeName || "Your store"}
          </h2>
          <p
            className="mt-1 text-sm"
            style={{ color: settings.mutedTextColor }}
          >
            {settings.tagline || "Your store tagline"}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="rounded-lg px-4 py-2 text-sm font-semibold"
              style={{ background: settings.primaryColor, color: "#FFFFFF" }}
            >
              Primary action
            </button>
            <button
              type="button"
              className="rounded-lg px-4 py-2 text-sm font-semibold"
              style={{ background: settings.secondaryColor, color: "#FFFFFF" }}
            >
              Secondary action
            </button>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                background: `${settings.warningColor}22`,
                color: settings.warningColor,
              }}
            >
              Status badge
            </span>
          </div>
        </div>

        {warnings.length > 0 && (
          <div
            className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800"
            role="alert"
          >
            {warnings.join(" ")}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600" role="status">
            {status}
          </p>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#1F3A2E] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save branding"}
          </button>
        </div>
      </form>
    </section>
  );
}
