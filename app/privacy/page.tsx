import fs from "fs";
import path from "path";
import matter from "gray-matter";

import SiteNavbar from "../../src/components/page-general/SiteNavbar";
import SiteFooter from "../../src/components/page-general/SiteFooter";
import ArticleHeader from "../../src/components/page-specific/ArticleHeader";
import PrivacyPolicyContent from "../../src/components/page-specific/PrivacyPolicyContent";
import PageLoaderGate from "../../src/components/page-general/PageLoaderGate";

export default function PrivacyPage() {
  const contactEmail = process.env.CONTACT_TO_EMAIL || "";
  const markdownPath = path.join(process.cwd(), "src/content/privacy-policy.md");
  const markdownContent = fs.readFileSync(markdownPath, "utf8");
  const { content, data } = matter(markdownContent);
  const resolvedContent = content.replaceAll("{{CONTACT_TO_EMAIL}}", contactEmail);

  const title = typeof data.title === "string" ? data.title : "Privacy Policy";
  const date = typeof data.date === "string" ? data.date : "2026-02-09";
  const author = typeof data.author === "string" ? data.author : "Staworth Limited";
  const headerImage =
    typeof data.header_image === "string"
      ? data.header_image.replace(/^\.\.\/\.\.\/\.\.\/public/, "")
      : undefined;

  return (
    <PageLoaderGate>
      <SiteNavbar />
      <main className="p-6 max-w-3xl mx-auto">
        <ArticleHeader
          title={title}
          date={date}
          datePrefix="Last Updated: "
          author={author}
          headerImage={headerImage}
        />
        <PrivacyPolicyContent content={resolvedContent} contactEmail={contactEmail} />
      </main>
      <SiteFooter />
    </PageLoaderGate>
  );
}
