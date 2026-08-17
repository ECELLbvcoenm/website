"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ExternalLink, MapPin, Calendar, Clock, Sparkles } from "lucide-react";

export const EVENT_DETAILS = {
  title: "Blockchain Fundamentals",
  host: "Cake Wallet",
  coHost: "Bitcoin Bharat",
  date: "17 August 2026",
  time: "10:00 AM – 12:00 PM",
  venue: "BVCOE, Navi Mumbai",
  description:
    "Join the Cake Wallet Campus Tour for an engaging introduction to Blockchain, Bitcoin, and Web3. Build a strong foundation, explore career opportunities, and connect with fellow builders.",
  registrationUrl: "https://luma.com/bt1u1gii",
  eventDate: new Date("2026-08-17T10:00:00+05:30"),
};

function getTimeRemaining(targetDate: Date) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

export default function EventPopup() {
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(getTimeRemaining(EVENT_DETAILS.eventDate));
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Listen for a manual trigger from anywhere in the app (e.g. a nav button)
    const handleCustomOpen = () => {
      setClosing(false);
      setVisible(true);
    };
    window.addEventListener("open-event-popup", handleCustomOpen);

    // Auto-show once per browser session, not on every single page load
    const alreadySeen = sessionStorage.getItem("ecell-event-popup-seen");
    let autoTimer: ReturnType<typeof setTimeout> | undefined;
    if (!alreadySeen) {
      autoTimer = setTimeout(() => {
        setClosing(false);
        setVisible(true);
        sessionStorage.setItem("ecell-event-popup-seen", "1");
      }, 1400);
    }

    return () => {
      window.removeEventListener("open-event-popup", handleCustomOpen);
      if (autoTimer) clearTimeout(autoTimer);
    };
  }, []);

  // Live countdown timer ticker
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setCountdown(getTimeRemaining(EVENT_DETAILS.eventDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [visible]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => setVisible(false), 400);
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`event-popup-backdrop ${closing ? "event-popup-backdrop-exit" : ""}`}
        onClick={handleClose}
      />

      {/* Popup Dialog */}
      <div className={`event-popup-container ${closing ? "event-popup-exit" : ""}`}>
        <div className="event-popup-card">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="event-popup-close"
            aria-label="Close popup"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Banner */}
          <div className="event-popup-banner">
            <div className="event-popup-banner-bg" />
            <div className="event-popup-banner-content">
              <div className="event-popup-badge flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-400 inline" />
                <span>FEATURED EVENT</span>
              </div>
              <h2 className="event-popup-title">{EVENT_DETAILS.title}</h2>
              <p className="event-popup-host">
                by <strong>{EVENT_DETAILS.host}</strong> × <strong>{EVENT_DETAILS.coHost}</strong>
              </p>
            </div>
          </div>

          {/* Countdown Display */}
          {!countdown.expired && (
            <div className="event-popup-countdown">
              {[
                { value: countdown.days, label: "Days" },
                { value: countdown.hours, label: "Hours" },
                { value: countdown.minutes, label: "Mins" },
                { value: countdown.seconds, label: "Secs" },
              ].map((item) => (
                <div key={item.label} className="event-popup-countdown-item">
                  <span className="event-popup-countdown-value">
                    {String(item.value).padStart(2, "0")}
                  </span>
                  <span className="event-popup-countdown-label">{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Event Details */}
          <div className="event-popup-details">
            <div className="event-popup-detail-row">
              <Calendar className="w-4 h-4" style={{ color: "var(--text-accent)", flexShrink: 0 }} />
              <span>{EVENT_DETAILS.date}</span>
            </div>
            <div className="event-popup-detail-row">
              <Clock className="w-4 h-4" style={{ color: "var(--text-accent)", flexShrink: 0 }} />
              <span>{EVENT_DETAILS.time}</span>
            </div>
            <div className="event-popup-detail-row">
              <MapPin className="w-4 h-4" style={{ color: "var(--text-accent)", flexShrink: 0 }} />
              <span>{EVENT_DETAILS.venue}</span>
            </div>
          </div>

          <p className="event-popup-description">{EVENT_DETAILS.description}</p>

          {/* CTA */}
          <a
            href={EVENT_DETAILS.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="event-popup-cta"
          >
            Register Now — Free
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </>
  );
}