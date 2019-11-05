import graph2tree, { buildTree } from "util/graph2tree";

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
  expect(graph2tree(require("./graph/fromLevel0.json"))).toBe(expected);
});

test("reference from Level1", () => {
  const expected = `# A01CF3..CC43E2 (3, 3)
    └ 061934..400772 (1, 2) <<
        └ 465D40..CF2F68
        └ 4FCBC9..FED28D`;
  expect(graph2tree(require("./graph/fromLevel1.json"))).toBe(expected);
});

test("reference from Level2", () => {
  const expected = `# A01CF3..CC43E2 (3, 3)
    └ 061934..400772 (1, 2)
        └ 465D40..CF2F68 <<`;
  expect(graph2tree(require("./graph/fromLevel2.json"))).toBe(expected);
});

test("reference from Level3", () => {
  const expected = `# A01CF3..CC43E2 (3, 3)
    └ 9835C3..CC92C2 (2, 3)
        └ 8BFDE2..7C93E0 (1, 1)
            └ A8443C..0ECC47 <<`;
  expect(graph2tree(require("./graph/fromLevel3.json"))).toBe(expected);
});


  // const tree: any = [];
  // expect(buildTree(require("./graph/fromLevel0.json"))).toBe(tree);
//  Array [
//    Array [
//      0,
//      Object {
//        "multisig": Object {
//          "account": "A01CF3467B7DC07C3C4EB0BFEE4D9E4DF572425BE04D306C1ECBC0580ECC43E2",
//          "accountAddress": "9012F8BC49EB30CB01D8B96574175464C00DB11FA1EE330CB5",
//          "cosignatories": Array [
//            "06193475C600A7A841AAB67F325198DA1EAE8ED7EC9ECFA75882B31D99400772",
//            "92BE08D5395330645E0AFA6746748F350F839F606B149B38D7326A8FDEC1E910",
//            "9835C3BA22D2A04F0358F41946E0C7621E46CB2388B5A4CCD74846EAE0CC92C2",
//          ],
//          "minApproval": 3,
//          "minRemoval": 1,
//          "multisigAccounts": Array [],
//        },
//      },
//      Array [
//        Array [
//          1,
//          Object {
//            "multisig": Object {
//              "account": "06193475C600A7A841AAB67F325198DA1EAE8ED7EC9ECFA75882B31D99400772",
//              "accountAddress": "90B98A52678021A68D97756F91A09435CF01B7D2D3645EB23E",
//              "cosignatories": Array [
//                "465D406398AD2AACEA7B89D69ECA8D1E3D11F9940B90EF57863CD96D5CCF2F68",
//                "4FCBC9479C25B58E96D3A6704011B2979F1F996C824A65172764860D26FED28D",
//              ],
//              "minApproval": 1,
//              "minRemoval": 1,
//              "multisigAccounts": Array [
//                "A01CF3467B7DC07C3C4EB0BFEE4D9E4DF572425BE04D306C1ECBC0580ECC43E2",
//              ],
//            },
//          },
//          Array [
//            Array [
//              2,
//              Object {
//                "multisig": Object {
//                  "account": "465D406398AD2AACEA7B89D69ECA8D1E3D11F9940B90EF57863CD96D5CCF2F68",
//                  "accountAddress": "906B54EA452D4FA60244A8744B89F4F78A8FADC5F5996FCFD1",
//                  "cosignatories": Array [],
//                  "minApproval": 0,
//                  "minRemoval": 0,
//                  "multisigAccounts": Array [
//                    "06193475C600A7A841AAB67F325198DA1EAE8ED7EC9ECFA75882B31D99400772",
//                  ],
//                },
//              },
//              Array [],
//            ],
//            Array [
//              2,
//              Object {
//                "multisig": Object {
//                  "account": "4FCBC9479C25B58E96D3A6704011B2979F1F996C824A65172764860D26FED28D",
//                  "accountAddress": "90648862A4B1538D352B31BAA5AC50B4B7C3DA118DA3FC4F78",
//                  "cosignatories": Array [],
//                  "minApproval": 0,
//                  "minRemoval": 0,
//                  "multisigAccounts": Array [
//                    "06193475C600A7A841AAB67F325198DA1EAE8ED7EC9ECFA75882B31D99400772",
//                  ],
//                },
//              },
//              Array [],
//            ],
//          ],
//        ],
//        Array [
//          1,
//          Object {
//            "multisig": Object {
//              "account": "92BE08D5395330645E0AFA6746748F350F839F606B149B38D7326A8FDEC1E910",
//              "accountAddress": "9036353A58D8CA5F3FFE6C3921E2AADD4FE282C4679CAA2D50",
//              "cosignatories": Array [],
//              "minApproval": 0,
//              "minRemoval": 0,
//              "multisigAccounts": Array [
//                "9835C3BA22D2A04F0358F41946E0C7621E46CB2388B5A4CCD74846EAE0CC92C2",
//                "A01CF3467B7DC07C3C4EB0BFEE4D9E4DF572425BE04D306C1ECBC0580ECC43E2",
//              ],
//            },
//          },
//          Array [],
//        ],
//        Array [
//          1,
//          Object {
//            "multisig": Object {
//              "account": "9835C3BA22D2A04F0358F41946E0C7621E46CB2388B5A4CCD74846EAE0CC92C2",
//              "accountAddress": "90904B287566D95B51A236E17253D26B39EBFD24A7B50FF8DE",
//              "cosignatories": Array [
//                "4F722246464BF31C64BB58422B05556FEA19250CE0DD4149979A3B1D39E4B27F",
//                "8BFDE2C8ADB53DA66387A73F154E0D9974868295C9849F0735C06BD5957C93E0",
//                "92BE08D5395330645E0AFA6746748F350F839F606B149B38D7326A8FDEC1E910",
//              ],
//              "minApproval": 2,
//              "minRemoval": 1,
//              "multisigAccounts": Array [
//                "A01CF3467B7DC07C3C4EB0BFEE4D9E4DF572425BE04D306C1ECBC0580ECC43E2",
//              ],
//            },
//          },
//          Array [
//            Array [
//              2,
//              Object {
//                "multisig": Object {
//                  "account": "4F722246464BF31C64BB58422B05556FEA19250CE0DD4149979A3B1D39E4B27F",
//                  "accountAddress": "90137BD12D0EA8BB96C5FFB16BD2A06EB147E9B7EAE1F7BB3A",
//                  "cosignatories": Array [],
//                  "minApproval": 0,
//                  "minRemoval": 0,
//                  "multisigAccounts": Array [
//                    "9835C3BA22D2A04F0358F41946E0C7621E46CB2388B5A4CCD74846EAE0CC92C2",
//                  ],
//                },
//              },
//              Array [],
//            ],
//            Array [
//              2,
//              Object {
//                "multisig": Object {
//                  "account": "8BFDE2C8ADB53DA66387A73F154E0D9974868295C9849F0735C06BD5957C93E0",
//                  "accountAddress": "906F53CF8395E331C8EABA0912C42DDA840C0D1B05D242CCC6",
//                  "cosignatories": Array [
//                    "A8443CB1C4F90630A4C8A4FAB81FE2D2C2C5760DF75440B710DDCFEA9F0ECC47",
//                  ],
//                  "minApproval": 1,
//                  "minRemoval": 1,
//                  "multisigAccounts": Array [
//                    "9835C3BA22D2A04F0358F41946E0C7621E46CB2388B5A4CCD74846EAE0CC92C2",
//                  ],
//                },
//              },
//              Array [
//                Array [
//                  3,
//                  Object {
//                    "multisig": Object {
//                      "account": "A8443CB1C4F90630A4C8A4FAB81FE2D2C2C5760DF75440B710DDCFEA9F0ECC47",
//                      "accountAddress": "90F0BFB1749F172208541B08273C53922F4D7E4F23B13EE265",
//                      "cosignatories": Array [],
//                      "minApproval": 0,
//                      "minRemoval": 0,
//                      "multisigAccounts": Array [
//                        "8BFDE2C8ADB53DA66387A73F154E0D9974868295C9849F0735C06BD5957C93E0",
//                      ],
//                    },
//                  },
//                  Array [],
//                ],
//              ],
//            ],
//            Array [
//              2,
//              Object {
//                "multisig": Object {
//                  "account": "92BE08D5395330645E0AFA6746748F350F839F606B149B38D7326A8FDEC1E910",
//                  "accountAddress": "9036353A58D8CA5F3FFE6C3921E2AADD4FE282C4679CAA2D50",
//                  "cosignatories": Array [],
//                  "minApproval": 0,
//                  "minRemoval": 0,
//                  "multisigAccounts": Array [
//                    "9835C3BA22D2A04F0358F41946E0C7621E46CB2388B5A4CCD74846EAE0CC92C2",
//                    "A01CF3467B7DC07C3C4EB0BFEE4D9E4DF572425BE04D306C1ECBC0580ECC43E2",
//                  ],
//                },
//              },
//              Array [],
//            ],
//          ],
//        ],
//      ],
//    ],
//  ]
