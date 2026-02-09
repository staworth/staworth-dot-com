"use client";

import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";

import SiteNavbar from "../../src/components/page-general/SiteNavbar";
import SiteFooter from "../../src/components/page-general/SiteFooter";
import PageSummary from "../../src/components/page-general/PageSummary";
import Loader from "../../src/components/page-general/Loader";

export default function ContactPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_TO_EMAIL || "";
  const mailtoHref = `mailto:${contactEmail}`;
  const gmailBaseCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}`;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [showEmailFallbackModal, setShowEmailFallbackModal] = useState(false);
  const [gmailFallbackUrl, setGmailFallbackUrl] = useState(gmailBaseCompose);
  const emailFallbackTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const clearEmailFallbackTimer = () => {
    if (emailFallbackTimerRef.current !== null) {
      window.clearTimeout(emailFallbackTimerRef.current);
      emailFallbackTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearEmailFallbackTimer();
    };
  }, []);

  const openGmailCompose = () => {
    window.open(gmailFallbackUrl, "_blank", "noopener,noreferrer");
    setShowEmailFallbackModal(false);
  };

  const launchMailClientWithFallback = (mailtoUrl: string, fallbackUrl: string) => {
    clearEmailFallbackTimer();
    setShowEmailFallbackModal(false);
    setGmailFallbackUrl(fallbackUrl);
    window.location.href = mailtoUrl;

    emailFallbackTimerRef.current = window.setTimeout(() => {
      // If focus remains on the page, a local mail client likely did not open.
      if (document.hasFocus()) {
        setShowEmailFallbackModal(true);
      }
      emailFallbackTimerRef.current = null;
    }, 700);
  };

  const handleEmailLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const mailtoUrl = mailtoHref;
    const fallbackUrl = gmailBaseCompose;
    launchMailClientWithFallback(mailtoUrl, fallbackUrl);
  };

  const handleMessageInput = (event: FormEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget;
    const baseHeight = 160;
    const maxHeight = baseHeight * 2;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    setSubmitting(true);
    setSubmitStatus("idle");
    setSubmitMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, subject, message }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Unable to send form right now.");
      }

      form.reset();
      setSubmitStatus("success");
      setSubmitMessage("Message sent successfully. We'll be in touch.");
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(error instanceof Error ? error.message : "Unable to send form right now.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <SiteNavbar />
      <PageSummary
        title="Contact Us"
        description="Reach out to a member of our team to discuss opportunities, raise questions or just say hey."
      />
      <main className="contact-main">
        <section className="contact-card">
          <form className="contact-form" onSubmit={handleSubmit}>
            <label className="contact-label" htmlFor="email">Your Email</label>
            <input
              className="contact-input"
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
            />

            <label className="contact-label" htmlFor="subject">Subject</label>
            <input
              className="contact-input"
              id="subject"
              name="subject"
              type="text"
              required
              maxLength={140}
            />

            <label className="contact-label" htmlFor="message">Message</label>
            <textarea
              className="contact-textarea"
              id="message"
              name="message"
              required
              rows={8}
              maxLength={5000}
              onInput={handleMessageInput}
            />

            <div className="contact-actions">
              <button className="contact-button" type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send Form"}
              </button>
              <a
                className="contact-button contact-button-secondary"
                href={mailtoHref}
                onClick={handleEmailLinkClick}
              >
                Email Us
              </a>
            </div>
            {submitStatus !== "idle" && (
              <p className="contact-privacy-note" role="status" aria-live="polite">
                {submitMessage}
              </p>
            )}
          </form>
          <p className="contact-privacy-note">
            Details of how Staworth Limited handles and stores personal data can be found in our{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>
        </section>
      </main>
      {showEmailFallbackModal && (
        <div className="contact-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="email-fallback-title">
          <div className="contact-modal-card">
            <p className="contact-modal-title" id="email-fallback-title">No Email Detected</p>
            <p className="contact-modal-body">
              Our site was unable to detect your local email client. Open a Gmail web compose window instead?
            </p>
            <div className="contact-modal-actions">
              <button className="contact-button contact-button-secondary" type="button" onClick={openGmailCompose}>
                Open
              </button>
              <button className="contact-button" type="button" onClick={() => setShowEmailFallbackModal(false)}>
                Back
              </button>
            </div>
          </div>
        </div>
      )}
      <SiteFooter />
    </>
  );
}
