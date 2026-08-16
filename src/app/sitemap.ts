import type { MetadataRoute } from "next";

import { repositories } from "@/lib/repositories";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", ...repositories.map(({ slug }) => `/repo/${slug}`)].map(
    (path) => ({ url: new URL(path, siteUrl).href }),
  );
}
