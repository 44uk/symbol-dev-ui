import graph2text from "../../util/graph2text";

test("reference from Root", () => {
  const expected = `* A01CF3..43E2 (3,3) <
  └ 061934..0772 (1,2)
    └ 465D40..2F68
    └ 4FCBC9..D28D
  └ 92BE08..E910
  └ 9835C3..92C2 (2,3)
    └ 4F7222..B27F
    └ 8BFDE2..93E0 (1,1)
      └ A8443C..CC47
    └ 92BE08..E910`;
  expect(graph2text(require("./graph/fromLevel0.json"))).toBe(expected);
});
test("reference from Level1", () => {
  const expected = `* A01CF3..43E2 (3,3)
  └ 061934..0772 (1,2) <
    └ 465D40..2F68
    └ 4FCBC9..D28D`;
  expect(graph2text(require("./graph/fromLevel1.json"))).toBe(expected);
});
test("reference from Level2", () => {
  const expected = `* A01CF3..43E2 (3,3)
  └ 061934..0772 (1,2)
    └ 465D40..2F68 <`;
  expect(graph2text(require("./graph/fromLevel2.json"))).toBe(expected);
});
test("reference from Level3", () => {
  const expected = `* A01CF3..43E2 (3,3)
  └ 9835C3..92C2 (2,3)
    └ 8BFDE2..93E0 (1,1)
      └ A8443C..CC47 <`;
  expect(graph2text(require("./graph/fromLevel3.json"))).toBe(expected);
});
