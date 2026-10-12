"use client";

import { useState } from "react";
import { LuCheck, LuMail, LuSparkles } from "react-icons/lu";

function bannerMessage(banner) {
  if (banner.scheduleStatus === "upcoming") return "This offer is coming soon.";
  if (banner.scheduleStatus === "expired") return "This offer has ended.";
  return banner.offerText;
}

function BannerImage({ src, alt, accentColor }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/70 md:aspect-[4/5]">
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center" style={{ color: accentColor }} aria-hidden="true">
          <LuSparkles size={32} />
        </div>
      )}
    </div>
  );
}

export function SpecialOfferBannerView({ banner, preview = false }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  if (!banner) return null;

  const scheduleStatus = banner.scheduleStatus || "active";
  const active = scheduleStatus === "active";

  const subscribe = async (event) => {
    event.preventDefault();
    setFeedback(null);
    setSubmitting(true);
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to subscribe.");
      setFeedback({ type: "success", message: data.message });
      setEmail("");
      setConsent(false);
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to subscribe. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto mt-16 max-w-[1280px] px-4 sm:px-6" aria-label="Special offer">
      <div
        className="relative isolate overflow-hidden rounded-[28px] p-5 shadow-sm sm:p-7 lg:p-9"
        style={{ backgroundColor: banner.backgroundColor, color: banner.textColor }}
      >
        <div className="pointer-events-none absolute -right-20 -top-28 -z-10 h-72 w-72 rounded-full opacity-[0.08]" style={{ backgroundColor: banner.accentColor }} />
        <div className="grid grid-cols-2 items-center gap-3 md:grid-cols-[1fr_1.2fr_1fr] md:gap-8">
          <div className="order-2 md:order-1">
            <BannerImage src={banner.leftImage} alt={`${banner.heading} promotion`} accentColor={banner.accentColor} />
          </div>

          <div className="order-1 col-span-2 px-1 py-3 text-center md:order-2 md:col-span-1 md:px-3 md:py-8">
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: banner.accentColor }}>
              <LuSparkles size={14} aria-hidden="true" /> Special offer
            </p>
            <h2 className="font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">{banner.heading}</h2>
            <p className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: banner.accentColor }}>
              {bannerMessage(banner)}
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed opacity-80 sm:text-base">{banner.description}</p>

            {active && banner.buttonText && banner.buttonUrl ? (
              <a href={banner.buttonUrl} className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" style={{ backgroundColor: banner.accentColor }}>
                {banner.buttonText}
              </a>
            ) : null}

            {active && banner.showSubscription ? (
              preview ? (
                <div className="mx-auto mt-6 max-w-md rounded-xl border border-black/10 bg-white/70 p-3 text-left">
                  <div className="flex gap-2">
                    <span className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-black/10 bg-white px-3 text-sm opacity-60"><LuMail size={15} /> Email address</span>
                    <span className="rounded-lg px-4 py-3 text-sm font-semibold text-white" style={{ backgroundColor: banner.accentColor }}>Subscribe</span>
                  </div>
                  <p className="mt-2 text-[11px] opacity-70">Email updates will be saved to the subscriber list.</p>
                </div>
              ) : (
                <form onSubmit={subscribe} className="mx-auto mt-6 max-w-md text-left">
                  <label htmlFor="special-offer-email" className="sr-only">Email address</label>
                  <div className="flex rounded-xl border border-black/10 bg-white p-1.5">
                    <span className="flex items-center pl-2" style={{ color: banner.accentColor }}><LuMail size={17} aria-hidden="true" /></span>
                    <input
                      id="special-offer-email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Your email address"
                      disabled={submitting}
                      className="min-w-0 flex-1 bg-transparent px-2.5 py-2 text-sm text-[#111318] outline-none placeholder:text-[#6B7280]"
                    />
                    <button type="submit" disabled={submitting} className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-60" style={{ backgroundColor: banner.accentColor }}>
                      {submitting ? "Joining…" : "Subscribe"}
                    </button>
                  </div>
                  <label className="mt-3 flex cursor-pointer items-start gap-2 text-left text-[11px] leading-relaxed opacity-80">
                    <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required disabled={submitting} className="mt-0.5" style={{ accentColor: banner.accentColor }} />
                    <span>I agree to receive email updates about offers. I can unsubscribe at any time.</span>
                  </label>
                  {feedback ? (
                    <p className="mt-2 text-xs" role={feedback.type === "error" ? "alert" : "status"}>
                      {feedback.type === "success" ? <LuCheck className="mr-1 inline" aria-hidden="true" /> : null}{feedback.message}
                    </p>
                  ) : null}
                </form>
              )
            ) : null}

            {banner.terms && active ? <p className="mx-auto mt-4 max-w-md text-[11px] leading-relaxed opacity-65">{banner.terms}</p> : null}
            {preview ? <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] opacity-55">Dashboard preview · unsaved changes</p> : null}
          </div>

          <div className="order-3">
            <BannerImage src={banner.rightImage} alt={`${banner.heading} offer`} accentColor={banner.accentColor} />
          </div>
        </div>
      </div>
    </section>
  );
}
