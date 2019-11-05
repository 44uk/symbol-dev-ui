import {
  convertHexToNum,
  convertHexToUint64,
  convertNumToHex,
  convertNumToUint64,
  convertUint64ToHex,
  convertUint64ToNum,
  decodeAddress,
  decodeHexToRaw,
  encodeAddress,
  encodeRawToHex,
} from "../../util/convert";

// test("Hex to Num", () => {
//   expect(convertHexToNum("0000000000000000")).toBe(0);
//   expect(convertHexToNum("ffffffffffffffff")).toBe(0);
// });

// test("Hex to Uint64", () => {
//   expect(convertHexToUint64("0000000000000000")).toBe([0, 0]);
//   expect(convertHexToUint64("ffffffffffffffff")).toBe([4294967295, 4294967295]);
// });

// test("Num to Hex", () => {
//   expect(convertNumToHex("4294967295")).toBe("ffffffff");
//   expect(convertNumToHex("18446744073709551615")).toBe("ffffffffffffffff");
// });

// test("Num to Uint64", () => {
//   expect(convertNumToUint64("4294967295")).toBe([4294967295, 0]);
//   expect(convertNumToUint64("18446744073709551615")).toBe([4294967295, 4294967295]);
// });

// test("Uint64 to Hex", () => {
//   expect(convertUint64ToHex([4294967295, 4294967295])).toBe("FFFFFFFFFFFFFFFFFFFF");
//   expect(convertUint64ToHex()).toBe();
// }

// test("Uint64 to Num", () => {
//   expect(convertUint64ToNum()).toBe();
//   expect(convertUint64ToNum()).toBe();
// };

xtest("decode Address", () => {
  expect(decodeAddress("SA5RSU7NHSA333LU6LA3WK6MQMSANL4IAV34LDI6"))
    .toBe("903B1953ED3C81BDED74F2C1BB2BCC832406AF880577C58D1E");
});

xtest("decode Hex to Raw", () => {
  expect(decodeHexToRaw("474f4f44204c55434b21")).toBe("GOOD LUCK!");
});

xtest("encode Address", () => {
  expect(encodeAddress("903B1953ED3C81BDED74F2C1BB2BCC832406AF880577C58D1E"))
    .toBe("SA5RSU7NHSA333LU6LA3WK6MQMSANL4IAV34LDI6");
});

xtest("encode Raw to Hex", () => {
  expect(encodeRawToHex("GOOD LUCK!")).toBe("474f4f44204c55434b21");
});
