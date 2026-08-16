import type { MapEdge, MapNode, MapNodeKind, SystemMap } from "@/lib/system-map";

const commit = "c65aa179db7bdd61e2c2821eac87f208a105c053";

function cite(path: string, label: string) {
  return { label, path, url: `https://github.com/xai-org/x-algorithm/blob/${commit}/${path}` };
}

function node(
  id: string,
  label: string,
  district: string,
  kind: MapNodeKind,
  summary: string,
  responsibility: string,
  x: number,
  y: number,
  height: number,
  path: string,
): MapNode {
  return { id, label, district, kind, summary, responsibility, x, y, height, citations: [cite(path, label)] };
}

function edge(
  id: string,
  from: string,
  to: string,
  kind: MapEdge["kind"],
  label: string,
  payload: string,
  description: string,
  path: string,
): MapEdge {
  return { id, from, to, kind, label, payload, description, citations: [cite(path, label)] };
}

export const batchH = [
  {
    slug: "x-algorithm",
    title: "X Algorithm: assemble the For You feed",
    subtitle: "In-network and learned retrieval feed one ranking, safety, selection, and blending pipeline per request.",
    orientation: "Follow a request across the top into candidate retrieval, then descend through ranking and filtering before the final feed returns.",
    snapshot: { branch: "main", commit: "c65aa17", analyzedAt: "2026-08-16" },
    nodes: [
      node("server", "For You server", "Request", "entry", "Accepts a viewer request and returns a composed timeline.", "Build query context, invoke the configured pipeline, and marshal its response.", 8, 18, 3, "home-mixer/for_you_server.rs"),
      node("pipeline", "Candidate pipeline", "Orchestration", "runtime", "Runs hydration, sources, filters, scorers, selectors, and side effects.", "Order the feed stages and execute independent work concurrently where possible.", 28, 18, 4, "candidate-pipeline/candidate_pipeline.rs"),
      node("query", "Query hydration", "Viewer context", "service", "Loads the viewer's recent actions and recommendation context.", "Prepare follows, blocks, mutes, history, and engagement sequences for retrieval and scoring.", 48, 12, 2, "home-mixer/query_hydrators/explicit_engagement_signals_query_hydrator.rs"),
      node("sources", "Candidate sources", "Retrieval", "compute", "Collects recent followed-account posts and out-of-network recommendations.", "Query Thunder, Phoenix retrieval, and SimClusters in parallel and merge their candidates.", 69, 18, 3, "home-mixer/candidate_pipeline/phoenix_candidate_pipeline.rs"),
      node("hydration", "Candidate hydration", "Features", "service", "Adds post, author, media, engagement, and safety features.", "Resolve the fields needed by filters, rankers, and response rendering.", 86, 30, 3, "home-mixer/candidate_hydrators/core_data_candidate_hydrator.rs"),
      node("ranker", "Phoenix ranker", "Ranking", "compute", "Predicts viewer actions and combines their probabilities into a score.", "Call the learned model and apply configured positive and negative action weights.", 75, 58, 4, "home-mixer/scorers/phoenix_scorer.rs"),
      node("selector", "Top-K selector", "Selection", "compute", "Orders candidates by score and retains the requested result set.", "Convert ranked candidates into the bounded organic feed selection.", 53, 65, 2, "home-mixer/selectors/top_k_score_selector.rs"),
      node("safety", "Visibility filtering", "Safety", "service", "Removes or interstitials posts using viewer relationships and safety labels.", "Enforce the per-viewer visibility verdict after ranking.", 32, 65, 3, "home-mixer/filters/vf_filter.rs"),
      node("blender", "Feed blender", "Composition", "runtime", "Interleaves ranked posts with ads, prompts, and other timeline items.", "Apply placement and adjacency rules before returning the final timeline.", 12, 54, 3, "home-mixer/selectors/blender_selector.rs"),
    ],
    edges: [
      edge("start", "server", "pipeline", "control", "start pipeline", "viewer request and product context", "The server delegates feed construction to the configured candidate pipeline.", "home-mixer/for_you_server.rs"),
      edge("hydrate-query", "pipeline", "query", "control", "hydrate viewer", "viewer ID and request metadata", "The pipeline gathers viewer state before requesting candidates.", "candidate-pipeline/query_hydrator.rs"),
      edge("retrieve", "query", "sources", "data", "retrieve candidates", "engagement sequence, follows, and exclusions", "Hydrated context fans out to in-network and out-of-network sources.", "home-mixer/candidate_pipeline/phoenix_candidate_pipeline.rs"),
      edge("hydrate-candidates", "sources", "hydration", "data", "load candidate features", "candidate post IDs", "Retrieved IDs are expanded with post, author, media, and relationship data.", "candidate-pipeline/hydrator.rs"),
      edge("score", "hydration", "ranker", "control", "score posts", "viewer and candidate features", "The learned ranker predicts actions for each hydrated candidate.", "home-mixer/scorers/phoenix_scorer.rs"),
      edge("select", "ranker", "selector", "data", "keep top results", "weighted candidate scores", "Candidates are sorted by final score and truncated to the requested size.", "home-mixer/selectors/top_k_score_selector.rs"),
      edge("filter", "selector", "safety", "control", "apply visibility", "selected posts and viewer context", "Post-selection filtering checks visibility verdicts before composition.", "home-mixer/filters/vf_filter.rs"),
      edge("blend", "safety", "blender", "data", "compose timeline", "allowed posts and non-post candidates", "The blender places organic and ancillary items into one feed.", "home-mixer/candidate_pipeline/for_you_candidate_pipeline.rs"),
      edge("respond", "blender", "server", "data", "return feed", "ordered timeline entries", "The composed timeline is marshalled into the For You response.", "home-mixer/for_you_server.rs"),
    ],
    journeys: [
      { id: "rank-feed", label: "Rank a For You request", summary: "Retrieve, hydrate, score, select, filter, and blend one viewer's feed.", edgeIds: ["start", "hydrate-query", "retrieve", "hydrate-candidates", "score", "select", "filter", "blend", "respond"] },
      { id: "safety-tail", label: "Apply the safety tail", summary: "Follow ranked posts through visibility decisions into final composition.", edgeIds: ["select", "filter", "blend", "respond"] },
    ],
    glossary: [
      { term: "In-network", definition: "Posts from accounts the viewer follows, retrieved from recent-post storage." },
      { term: "Out-of-network", definition: "Posts discovered beyond the follow graph through learned retrieval or clusters." },
      { term: "Hydrator", definition: "A pipeline stage that attaches data or features needed by later stages." },
      { term: "Visibility verdict", definition: "A per-viewer decision to allow, interstitial, or drop a post." },
    ],
    learningPath: [
      { title: "Read the pipeline", description: "Start with PhoenixCandidatePipeline and list its query, source, filter, scorer, and selector stages." },
      { title: "Trace one candidate", description: "Follow a post from Thunder or Phoenix retrieval through feature hydration and scoring." },
      { title: "Separate rank from safety", description: "Compare score-based ordering with the later visibility decision and blending rules." },
    ],
  },
] satisfies readonly SystemMap[];
