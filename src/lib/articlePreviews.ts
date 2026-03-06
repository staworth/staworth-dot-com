import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type ArticlePreview = {
  link: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image: string;
};

const PREVIEW_SLUGS = ["beefy-octav-financial-hub", "introducing"] as const;

function formatDate(dateString?: string): string {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

function normalizePublicPath(imagePath?: string): string {
  if (!imagePath || typeof imagePath !== "string") {
    return "/logos/Staworth_1_1_Black.webp";
  }

  return imagePath.replace(/^\.\.\/\.\.\/\.\.\/public/, "");
}

function deriveCategory(tags: unknown): string {
  if (!Array.isArray(tags) || tags.length === 0) {
    return "ARTICLE";
  }

  const normalizedTags = tags
    .map((tag) => String(tag).toLowerCase().trim())
    .filter(Boolean);

  if (normalizedTags.includes("beefy")) {
    return "BEEFY";
  }

  return normalizedTags[0].toUpperCase();
}

export function getArticlePreviews(): ArticlePreview[] {
  const articlesDirectory = path.join(process.cwd(), "src/content/articles");

  return PREVIEW_SLUGS.map((slug) => {
    const filePath = path.join(articlesDirectory, `${slug}.md`);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);

    const previewImage = normalizePublicPath(data.preview_image ?? data.header_image);

    return {
      link: data.external_url || `https://www.staworth.com/articles/${slug}`,
      title: data.title || slug,
      date: formatDate(data.date),
      category: deriveCategory(data.tags),
      description: data.short_description || "",
      image: previewImage,
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
