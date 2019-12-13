import {
  Transaction,
  Transfer,
} from "util/byte"

test("Transaction", () => {
  const sum = Object.values(Transaction).reduce((a: number, v) => a += v.byte, 0)
  expect(sum).toBe(128)
})

test("Transfer", () => {
  const sum = Object.values(Transfer({})).reduce((a: number, v) => a += v.byte, 0)
  expect(sum).toBe(49)
})

test("Transfer", () => {
  const sum = Object.values(Transfer({ mosaicCount: 2 })).reduce((a: number, v) => a += v.byte, 0)
  expect(sum).toBe(65)
})

test("Transfer", () => {
  const sum = Object.values(Transfer({ payloadLength: 1023 })).reduce((a: number, v) => a += v.byte, 0)
  expect(sum).toBe(1072)
})
