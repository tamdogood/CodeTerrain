import { assertSystemMaps } from "@/lib/system-map";
import { repositories } from "@/lib/repositories";

import { batchA } from "./batch-a";
import { batchB } from "./batch-b";
import { batchC } from "./batch-c";
import { batchD } from "./batch-d";
import { batchE } from "./batch-e";
import { herdrMap } from "./herdr";

export const systemMaps = [
  herdrMap,
  ...batchA,
  ...batchB,
  ...batchC,
  ...batchD,
  ...batchE,
];

assertSystemMaps(systemMaps);

const mapsBySlug = new Map(systemMaps.map((map) => [map.slug, map]));
const missingMaps = repositories.filter(
  ({ status, slug }) => status === "live" && !mapsBySlug.has(slug),
);

if (missingMaps.length > 0) {
  throw new Error(`Live repositories without map data: ${missingMaps.map(({ slug }) => slug).join(", ")}`);
}

export const systemMapBySlug = (slug: string) => mapsBySlug.get(slug);
