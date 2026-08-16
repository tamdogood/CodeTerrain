import assert from "node:assert/strict";
import test from "node:test";

test("repository sorts surface popular and approachable maps", async () => {
  const { repositories, sortRepositories } = await import(
    new URL("./repositories.ts", import.meta.url).href
  );
  assert.equal(repositories.length, 66);
  assert.equal(sortRepositories(repositories, "popular")[0].slug, "react");
  assert.equal(sortRepositories(repositories, "approachable")[0].difficulty, "Approachable");
  assert.equal(sortRepositories(repositories, "name")[0].name, "Beads");
});
