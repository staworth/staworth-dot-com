import React from "react";

export type ArticleLink = {
  href: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image: string;
};

export default function Article({
  href,
  title,
  date,
  category,
  description,
  image,
}: ArticleLink) {
  // Check if it's an internal link (starts with /)
  const isInternal = href.startsWith('/');

  return (
    <a
      className="article-preview"
      href={href}
      target={isInternal ? '_self' : '_blank'}
      rel={isInternal ? undefined : 'noopener noreferrer'}
    >
      <div className="article-row">
        <div className="article-column text-col" style={{ marginRight: 30 }}>
          <p className="article-header">{title}</p>
          <div className="article-meta">
            <span className="article-date">{date}</span>
            <span className="article-category">{category}</span>
          </div>
          {/* Mobile image */}
          <div className="article-image-wrapper article-image-mobile mobile-only">
            <img className="article-image" src={image} alt={title} />
          </div>
          <p className="article-description">{description}</p>
        </div>
        {/* Desktop image */}
        <div className="article-column image-col desktop-only">
          <div className="article-image-wrapper article-image-desktop">
            <img className="article-image" src={image} alt={title} />
          </div>
        </div>
      </div>
    </a>
  );
}
