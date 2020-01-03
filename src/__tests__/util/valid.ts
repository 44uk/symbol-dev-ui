import {
  Account, NetworkType
} from "nem2-sdk"
import { isValidAddress } from "util/valid"

function NetworkTypeSeq() {
  let idx = 0
  const seq = [
    NetworkType.MIJIN_TEST,
    NetworkType.MIJIN,
    NetworkType.TEST_NET,
    NetworkType.MAIN_NET
  ]
  return () => {
    idx = idx >= seq.length - 1 ? 0 : idx + 1
    return seq[idx]
  }
}

test("isValidAddress", () => {
  const seq = NetworkTypeSeq()
  for(let i = 0; i < 32; i++) {
    const account = Account.generateNewAccount(seq())
    expect(isValidAddress(account.address.plain())).toEqual(true)
  }
})
