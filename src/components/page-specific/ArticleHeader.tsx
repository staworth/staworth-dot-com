import Image from "next/image";

export type ArticleHeaderProps = {
  title: string;
  date: string;
  datePrefix?: string;
  author: string;
  headerImage?: string;
  headerMediaType?: string;
  headerMediaUrl?: string;
};

export default function ArticleHeader({
  title,
  date,
  datePrefix = "",
  author,
  headerImage,
  headerMediaType,
  headerMediaUrl,
}: ArticleHeaderProps) {
  // Format the date for display
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const normalizedHeaderMediaType = (headerMediaType || "").toLowerCase();
  const mediaUrl = headerMediaUrl || headerImage || "";
  const isGif = mediaUrl.toLowerCase().endsWith(".gif");
  const isMp4 = mediaUrl.toLowerCase().endsWith(".mp4");
  const isYoutube = normalizedHeaderMediaType === "youtube";
  const isVideo = normalizedHeaderMediaType === "video";
  const isImage = normalizedHeaderMediaType === "image";

  return (
    <header className="article-header-container">
      {/* Row 1: Cover image/video - 100% width */}
      <div className="article-header-image">
        {isYoutube && headerMediaUrl ? (
          <iframe
            src={headerMediaUrl}
            title={`${title} video`}
            className="article-header-embed"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : isVideo ? (
          <video
            src={mediaUrl}
            className="w-full h-auto"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : isImage && isGif ? (
          <img
            src={mediaUrl}
            alt={title}
            className="w-full h-auto"
          />
        ) : isImage ? (
          <Image
            src={mediaUrl}
            alt={title}
            width={1200}
            height={675}
            className="w-full h-auto"
            priority
          />
        ) : mediaUrl && isMp4 ? (
          <video
            src={mediaUrl}
            className="w-full h-auto"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : mediaUrl && isGif ? (
          <img
            src={mediaUrl}
            alt={title}
            className="w-full h-auto"
          />
        ) : mediaUrl ? (
          <Image
            src={mediaUrl}
            alt={title}
            width={1200}
            height={675}
            className="w-full h-auto"
            priority
          />
        ) : null}
      </div>

      {/* Row 2: Title - 100% width */}
      <h1 className="article-header-title">{title}</h1>

      {/* Row 3: Date (left 50%) and Author (right 50%) */}
      <div className="article-header-meta">
        <span className="article-header-date">{`${datePrefix}${formattedDate}`}</span>
        <span className="article-header-author">{author}</span>
      </div>
    </header>
  );
}
