import React from "react";

export type ArticleLink = {
  href: string;
  title: string;
  date: string;
  category: string;
  tags?: string[];
  description: string;
  image: string;
};

export default function Article({
  href,
  title,
  date,
  category,
  tags,
  description,
  image,
}: ArticleLink) {
  // Use tags array if available, otherwise fall back to single category
  const displayTags = tags && tags.length > 0 ? tags : [category];
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
            <div className="article-tags">
              {displayTags.map((tag, index) => (
                <span key={index} className="article-category">{tag}</span>
              ))}
            </div>
          </div>
          {/* Mobile image */}
          <div className="article-image-wrapper article-image-mobile mobile-only">
            <img className="article-image" src={image} alt={title} />
          </div>
          <div className="article-description-box">
            <p className="article-description">{description}</p>
          </div>
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
