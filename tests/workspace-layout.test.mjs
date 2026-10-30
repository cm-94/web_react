import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const compiled = ts.transpileModule(
  fs.readFileSync("src/components/workspace/layout.ts", "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  },
).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);
const { arrange, parseLayout, reorder, resizePair, defaultLayout } =
  context.exports;
const plain = (value) => JSON.parse(JSON.stringify(value));
test("선택 순서와 행 개수, 중복 제거", () => {
  const layout = arrange(
    ["trading3002", "trading3001", "trading3007", "trading3001"],
    2,
  );
  assert.deepEqual(plain(layout.ids), [
    "trading3002",
    "trading3001",
    "trading3007",
  ]);
  assert.equal(layout.heights.length, 2);
  assert.throws(() => arrange([], 3));
});
test("드래그 순서 변경은 크기와 원본을 유지", () => {
  const result = reorder(defaultLayout, 0, 2);
  assert.equal(result.ids[2], "trading3001");
  assert.equal(defaultLayout.ids[0], "trading3001");
  assert.deepEqual(plain(result.widths), plain(defaultLayout.widths));
});
test("가로·세로 리사이즈는 총합, 최소 크기, 양쪽 최대 크기 보장", () => {
  assert.deepEqual(plain(resizePair([24, 52, 24], 0, 200, 8)), [68, 8, 24]);
  assert.deepEqual(
    plain(resizePair([430, 390], 0, -900, 180, 1200)),
    [180, 640],
  );
  assert.deepEqual(
    plain(resizePair([1000, 1100], 0, -1000, 180, 1200)),
    [900, 1200],
  );
});
test("저장한 배치 복원 및 손상된 저장값 복구", () => {
  const layout = arrange(["trading3007", "trading3002"], 1);
  assert.deepEqual(plain(parseLayout(JSON.stringify(layout))), plain(layout));
  for (const bad of [
    "null",
    "broken",
    JSON.stringify({ ...defaultLayout, ids: ["unknown"] }),
    JSON.stringify({ ...defaultLayout, heights: [0, 390] }),
    JSON.stringify({ ...defaultLayout, widths: [1, 1, 1] }),
  ])
    assert.deepEqual(plain(parseLayout(bad)), plain(defaultLayout));
});
