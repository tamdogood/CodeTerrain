import { assertSystemMaps } from "@/lib/system-map";
import { repositories } from "@/lib/repositories";

import { batchA } from "./batch-a";
import { batchB } from "./batch-b";
import { batchC } from "./batch-c";

export const systemMaps = [...batchA, ...batchB, ...batchC];

assertSystemMaps(systemMaps);

const mapsBySlug = new Map(systemMaps.map((map) => [map.slug, map]));
const missingMaps = repositories.filter(
  ({ status, mapPath, slug }) => status === "live" && !mapPath && !mapsBySlug.has(slug),
);

if (missingMaps.length > 0) {
  throw new Error(`Live repositories without map data: ${missingMaps.map(({ slug }) => slug).join(", ")}`);
}

export const systemMapBySlug = (slug: string) => mapsBySlug.get(slug);
