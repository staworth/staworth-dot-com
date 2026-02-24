import React from "react";
import Image from "next/image";

const links = [
  {
    label: "RSS",
    href: "/rss.xml",
    logo: "/images/links/rss.webp",
  },
  {
    label: "Atom",
    href: "/atom.xml",
    logo: "/images/links/rss.webp",
  },
  {
    label: "Substack",
    href: "https://staworth.substack.com",
    logo: "/images/links/substack.webp",
  },
  {
    label: "Paragraph",
    href: "https://paragraph.xyz/@staworth",
    logo: "/images/links/paragraph.webp",
  },
];

export default function ArticleSubscribe() {
  return (
    <section className="subscribe-container" aria-label="Subscribe">
      <p className="subscribe-title">Subscribe:</p>
      <div className="subscribe-actions">
        {links.map((link) => (
          <a
            key={link.label}
            className="subscribe-btn"
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            <span className="subscribe-icon" aria-hidden="true">
              <Image src={link.logo} alt="" width={20} height={20} />
            </span>
            <span className="subscribe-label">{link.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
