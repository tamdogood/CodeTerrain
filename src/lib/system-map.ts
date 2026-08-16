export type SourceCitation = {
  label: string;
  path: string;
  url: string;
};

export type MapNodeKind =
  | "entry"
  | "service"
  | "compute"
  | "storage"
  | "runtime"
  | "tooling"
  | "external";

export type MapNode = {
  id: string;
  label: string;
  district: string;
  kind: MapNodeKind;
  summary: string;
  responsibility: string;
  x: number;
  y: number;
  height: number;
  citations: readonly SourceCitation[];
};

export type MapEdge = {
  id: string;
  from: string;
  to: string;
  kind: "control" | "data" | "state";
  label: string;
  payload: string;
  description: string;
  citations: readonly SourceCitation[];
};

export type MapJourney = {
  id: string;
  label: string;
  summary: string;
  edgeIds: readonly string[];
};

export type GlossaryTerm = {
  term: string;
  definition: string;
};

export type LearningStep = {
  title: string;
  description: string;
};

export type SystemMap = {
  slug: string;
  title: string;
  subtitle: string;
  orientation: string;
  snapshot: {
    branch: string;
    commit: string;
    analyzedAt: string;
  };
  nodes: readonly MapNode[];
  edges: readonly MapEdge[];
  journeys: readonly MapJourney[];
  glossary: readonly GlossaryTerm[];
  learningPath: readonly LearningStep[];
};

export function assertSystemMaps(maps: readonly SystemMap[]) {
  if (new Set(maps.map(({ slug }) => slug)).size !== maps.length) {
    throw new Error("System map collection contains duplicate slugs");
  }

  for (const map of maps) {
    const nodeIds = new Set(map.nodes.map(({ id }) => id));
    const edgeIds = new Set(map.edges.map(({ id }) => id));

    if (nodeIds.size !== map.nodes.length || edgeIds.size !== map.edges.length) {
      throw new Error(`${map.slug} contains duplicate node or edge IDs`);
    }

    for (const edge of map.edges) {
      if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
        throw new Error(`${map.slug}/${edge.id} references an unknown node`);
      }
    }

    for (const item of [...map.nodes, ...map.edges]) {
      if (
        item.citations.length === 0 ||
        item.citations.some(({ path, url }) => !path || !url.includes("/blob/"))
      ) {
        throw new Error(`${map.slug}/${item.id} is missing a pinned source citation`);
      }
    }

    if (
      map.nodes.some(
        ({ x, y, height }) =>
          x < 0 || x > 100 || y < 0 || y > 100 || height < 1 || height > 4,
      )
    ) {
      throw new Error(`${map.slug} contains an out-of-bounds building`);
    }

    for (const journey of map.journeys) {
      if (journey.edgeIds.some((edgeId) => !edgeIds.has(edgeId))) {
        throw new Error(`${map.slug}/${journey.id} references an unknown edge`);
      }
    }
  }
}
