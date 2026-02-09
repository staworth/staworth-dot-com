import Image from "next/image";

export type ArticleHeaderProps = {
  title: string;
  date: string;
  author: string;
  headerImage?: string;
  datePrefix?: string;
};

export default function ArticleHeader({
  title,
  date,
  author,
  headerImage,
  datePrefix = "",
}: ArticleHeaderProps) {
  // Format the date for display
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isGif = typeof headerImage === "string" && headerImage.toLowerCase().endsWith(".gif");
  const isMp4 = typeof headerImage === "string" && headerImage.toLowerCase().endsWith(".mp4");

  return (
    <header className="article-header-container">
      {/* Row 1: Cover image/video - 100% width (optional) */}
      {headerImage && (
        <div className="article-header-image">
          {isMp4 ? (
            <video
              src={headerImage}
              className="w-full h-auto"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : isGif ? (
            <img
              src={headerImage}
              alt={title}
              className="w-full h-auto"
            />
          ) : (
            <Image
              src={headerImage}
              alt={title}
              width={1200}
              height={675}
              className="w-full h-auto"
              priority
            />
          )}
        </div>
      )}

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
