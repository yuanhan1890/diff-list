import { diffList, DiffType } from "../src/diff-list-myers"


describe("test", () => {
  it("both empty", () => {
    const arr = diffList({
      before: [],
      after: [],
      getId() {
        return ''
      },
    });

    expect(arr).toEqual([]);
  })

  it("before empty", () => {
    const arr = diffList({
      before: [],
      after: ["A", "B", "C", "D"],
      getId: d => d,
    });

    expect(arr).toEqual([
      { after: "A", type: DiffType.created, id: "A" },
      { after: "B", type: DiffType.created, id: "B" },
      { after: "C", type: DiffType.created, id: "C" },
      { after: "D", type: DiffType.created, id: "D" },
    ])
  })

  it("after empty", () => {
    const arr = diffList({
      after: [],
      before: ["A", "B", "C", "D"],
      getId: d => d,
    });

    expect(arr).toEqual([
      { before: "A", type: DiffType.deleted, id: "A" },
      { before: "B", type: DiffType.deleted, id: "B" },
      { before: "C", type: DiffType.deleted, id: "C" },
      { before: "D", type: DiffType.deleted, id: "D" },
    ])
  })

  it("meyers classic example", () => {
    const arr = diffList({
      before: "ABCABBA".split(""),
      after: "CBABAC".split(""),
      getId: d => d,
    });

    expect(arr).toEqual([
      { before: "A", type: DiffType.deleted, id: "A" },
      { before: "B", type: DiffType.deleted, id: "B" },
      { before: "C", after: "C", type: DiffType.normal, id: "C" },
      { after: "B", type: DiffType.created, id: "B" },
      { before: "A", after: "A", type: DiffType.normal, id: "A" },
      { before: "B", after: "B", type: DiffType.normal, id: "B" },
      { before: "B", type: DiffType.deleted, id: "B" },
      { before: "A", after: "A", type: DiffType.normal, id: "A" },
      { after: "C", type: DiffType.created, id: "C" },
    ])
  })
})
