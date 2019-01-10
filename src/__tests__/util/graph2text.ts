import graph2text from "../../util/graph2text";

test("reference from Root", () => {
  const expected = `# A01CF3..CC43E2 (3, 3) <<
    └ 061934..400772 (1, 2)
        └ 465D40..CF2F68
        └ 4FCBC9..FED28D
    └ 92BE08..C1E910
    └ 9835C3..CC92C2 (2, 3)
        └ 4F7222..E4B27F
        └ 8BFDE2..7C93E0 (1, 1)
            └ A8443C..0ECC47
        └ 92BE08..C1E910`;
  expect(graph2text(require("./graph/fromLevel0.json"))).toBe(expected);
});

test("reference from Level1", () => {
  const expected = `# A01CF3..CC43E2 (3, 3)
    └ 061934..400772 (1, 2) <<
        └ 465D40..CF2F68
        └ 4FCBC9..FED28D`;
  expect(graph2text(require("./graph/fromLevel1.json"))).toBe(expected);
});

test("reference from Level2", () => {
  const expected = `# A01CF3..CC43E2 (3, 3)
    └ 061934..400772 (1, 2)
        └ 465D40..CF2F68 <<`;
  expect(graph2text(require("./graph/fromLevel2.json"))).toBe(expected);
});

test("reference from Level3", () => {
  const expected = `# A01CF3..CC43E2 (3, 3)
    └ 9835C3..CC92C2 (2, 3)
        └ 8BFDE2..7C93E0 (1, 1)
            └ A8443C..0ECC47 <<`;
  expect(graph2text(require("./graph/fromLevel3.json"))).toBe(expected);
});
