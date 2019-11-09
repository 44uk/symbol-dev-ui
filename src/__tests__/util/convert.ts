import {
  convertHexToNum,
  convertHexToUInt64,
  convertNumToHex,
  convertNumToUInt64,
  convertUInt64ToHex,
  convertUInt64ToNum,
  decodeAddress,
  encodeAddress,
  decodeHexToRaw,
  encodeRawToHex,
} from "util/convert";

test("Hex to Num", () => {
  expect(convertHexToNum("0000000000000000")).toBe(0);
  expect(convertHexToNum("FFFFFFFFFFFFFFFF")).toBe(18446744073709551615);
});

test("Hex to Uint64", () => {
  expect(convertHexToUInt64("0000000000000000")).toEqual('[0,0]');
  expect(convertHexToUInt64("FFFFFFFFFFFFFFFF")).toEqual('[4294967295,4294967295]');
});

test("Num to Hex", () => {
  expect(convertNumToHex("4294967295")).toBe("FFFFFFFF");
  expect(convertNumToHex(Number.MAX_SAFE_INTEGER.toString())).toBe("1FFFFFFFFFFFFF");
  // expect(convertNumToHex("18446744073709551615")).toBe("ffffffffffffffff");
});

test("Num to UInt64", () => {
  expect(convertNumToUInt64("4294967295")).toEqual('[4294967295,0]');
  expect(convertNumToUInt64(Number.MAX_SAFE_INTEGER.toString())).toEqual('[4294967295,2097151]');
  // expect(convertNumToUInt64(18446744073709551615)).toEqual({ lower: 4294967295, higher: 4294967295 });
});

test("Uint64 to Hex", () => {
  expect(convertUInt64ToHex("[         0,         0]")).toBe("0000000000000000");
  expect(convertUInt64ToHex("[4294967295,4294967295]")).toBe("FFFFFFFFFFFFFFFF");
});

test("Uint64 to Num", () => {
  expect(convertUInt64ToNum("[         0,         0]")).toBe(0);
  expect(convertUInt64ToNum("[4294967295,   2097151]")).toBe(Number.MAX_SAFE_INTEGER);
  // expect(convertUInt64ToNum("[4294967295,4294967295]")).toBe();
});

test("decode Address", () => {
  expect(decodeAddress("SA5RSU7NHSA333LU6LA3WK6MQMSANL4IAV34LDI6"))
    .toBe("903B1953ED3C81BDED74F2C1BB2BCC832406AF880577C58D1E");
});

test("encode Address", () => {
  expect(encodeAddress("903B1953ED3C81BDED74F2C1BB2BCC832406AF880577C58D1E"))
    .toBe("SA5RSU7NHSA333LU6LA3WK6MQMSANL4IAV34LDI6");
});

test("decode Hex to Raw", () => {
  expect(decodeHexToRaw("474F4F44204C55434B21")).toBe("GOOD LUCK!");
});

test("encode Raw to Hex", () => {
  expect(encodeRawToHex("GOOD LUCK!")).toBe("474F4F44204C55434B21");
});
