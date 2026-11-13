import { NextResponse } from "next/server";

export const revalidate = 3600;

const BEEFY_ORIGIN = "https://beefy.com";
const BEEFY_PAGE_DATA_URL = `${BEEFY_ORIGIN}/page-data/articles`;
const ARTICLE_CUTOFF = Date.UTC(2024, 2, 1);

type GatsbyImage = {
  childImageSharp?: {
    gatsbyImageData?: {
      images?: {
        fallback?: { src?: string };
        sources?: Array<{ type?: string; srcSet?: string }>;
      };
    };
  };
};

type BeefyArticleNode = {
  fields?: { slug?: string };
  frontmatter?: {
    title?: string;
    date?: string;
    short_description?: string;
    header_image?: GatsbyImage;
  };
};

type GatsbyPageData = {
  result?: {
    data?: { allMarkdownRemark?: { edges?: Array<{ node?: BeefyArticleNode }> } };
    pageContext?: { numPages?: number };
  };
};

function getImageUrl(image?: GatsbyImage): string {
  const imageData = image?.childImageSharp?.gatsbyImageData?.images;
  const webpSrcSet = imageData?.sources?.find((source) => source.type === "image/webp")?.srcSet;
  const largestWebp = webpSrcSet?.split(",").at(-1)?.trim().split(/\s+/)[0];
  const src = largestWebp ?? imageData?.fallback?.src;
  return src ? new URL(src, BEEFY_ORIGIN).toString() : "/logos/Staworth_1_1_Black.webp";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

async function getPageData(page: number): Promise<GatsbyPageData> {
  const pagePath = page === 1 ? "" : `/page/${page}`;
  const response = await fetch(`${BEEFY_PAGE_DATA_URL}${pagePath}/page-data.json`);
  if (!response.ok) {
    throw new Error(`Beefy page ${page} returned ${response.status}`);
  }
  return response.json() as Promise<GatsbyPageData>;
}

export async function GET() {
  try {
    const firstPage = await getPageData(1);
    const pageCount = Math.max(1, Math.min(firstPage.result?.pageContext?.numPages ?? 1, 100));
    const remainingPages = await Promise.all(
      Array.from({ length: pageCount - 1 }, (_, index) => getPageData(index + 2)),
    );
    const pages = [firstPage, ...remainingPages];
    const articles = pages.flatMap((page) =>
      (page.result?.data?.allMarkdownRemark?.edges ?? []).flatMap(({ node }) => {
        const slug = node?.fields?.slug;
        const data = node?.frontmatter;
        if (!slug || !data?.title || !data.date) return [];
        const publishedAt = new Date(data.date).getTime();
        if (Number.isNaN(publishedAt) || publishedAt < ARTICLE_CUTOFF) return [];

        return [{
          href: `${BEEFY_ORIGIN}/articles/${slug}/`,
          title: data.title,
          date: formatDate(data.date),
          category: "BEEFY",
          categories: ["BEEFY"],
          tags: ["BEEFY"],
          description: data.short_description ?? "",
          image: getImageUrl(data.header_image),
          headerMediaType: null,
        }];
      }),
    );

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching Beefy articles:", error);
    return NextResponse.json({ error: "Unable to fetch Beefy articles" }, { status: 502 });
  }
}
