"use client";

import { MouseEvent, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type PrivacyPolicyContentProps = {
  content: string;
  contactEmail: string;
};

export default function PrivacyPolicyContent({ content, contactEmail }: PrivacyPolicyContentProps) {
  const [showEmailFallbackModal, setShowEmailFallbackModal] = useState(false);
  const emailFallbackTimerRef = useRef<number | null>(null);
  const mailtoHref = `mailto:${contactEmail}`;
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}`;

  const clearEmailFallbackTimer = () => {
    if (emailFallbackTimerRef.current !== null) {
      window.clearTimeout(emailFallbackTimerRef.current);
      emailFallbackTimerRef.current = null;
    }
  };

  const openGmailCompose = () => {
    window.open(gmailComposeUrl, "_blank", "noopener,noreferrer");
    setShowEmailFallbackModal(false);
  };

  const handleEmailLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    clearEmailFallbackTimer();
    setShowEmailFallbackModal(false);
    window.location.href = mailtoHref;

    emailFallbackTimerRef.current = window.setTimeout(() => {
      // If focus remains on the page, a local mail client likely did not open.
      if (document.hasFocus()) {
        setShowEmailFallbackModal(true);
      }
      emailFallbackTimerRef.current = null;
    }, 700);
  };

  return (
    <>
      <div className="leading-normal">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children, ...props }) => {
              if (href?.startsWith("mailto:")) {
                return (
                  <a href={href} onClick={handleEmailLinkClick} {...props}>
                    {children}
                  </a>
                );
              }

              return (
                <a href={href} {...props}>
                  {children}
                </a>
              );
            },
            table: ({ children, ...props }) => (
              <div className="my-6 article-table-wrapper">
                <table className="w-full text-white article-table" {...props}>{children}</table>
              </div>
            ),
            thead: ({ children, ...props }) => (
              <thead {...props}>{children}</thead>
            ),
            tbody: ({ children, ...props }) => (
              <tbody {...props}>{children}</tbody>
            ),
            tr: ({ children, ...props }) => (
              <tr {...props}>{children}</tr>
            ),
            th: ({ children, ...props }) => (
              <th className="text-left font-bold" {...props}>{children}</th>
            ),
            td: ({ children, ...props }) => (
              <td {...props}>{children}</td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
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
    </>
  );
}
