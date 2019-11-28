import React, { useState, useEffect } from "react"

import {
  Account,
  NetworkType
} from "nem2-sdk"

interface IProps {
  onSetAccount: React.Dispatch<React.SetStateAction<Account | null>>
  onSetPretty: React.Dispatch<React.SetStateAction<boolean>>
}

function generateNewPrivateKey(networkType = NetworkType.MIJIN_TEST, vanity?: string) {
  let account = Account.generateNewAccount(networkType)
  while(vanity && vanity !== "N" && account.address.plain()[1] !== vanity) {
    account = Account.generateNewAccount(networkType)
  }
  return account.privateKey
}

function generateNewAccount(networkType = NetworkType.MIJIN_TEST, key?: string) {
  let account: Account | null = null
  if(key) {
    try {
      account = Account.createFromPrivateKey(key, networkType)
    } catch(error) {
      console.error(error)
    }
  } else {
    account = Account.generateNewAccount(networkType)
  }
  return account
}

export const Input: React.FC<IProps> = ({
  onSetAccount,
  onSetPretty,
}) => {
  const [privateKey, setPrivateKey] = useState("")
  const [networkType, setNetworkType] = useState(NetworkType.MIJIN_TEST)
  const [pretty, setPretty] = useState(true)
  const [vanity, setVanity] = useState("N")

  useEffect(() => {
    if(privateKey.length < 64) { return }
    const newAccount = generateNewAccount(networkType, privateKey)
    onSetAccount(newAccount)
  }, [privateKey, networkType, onSetAccount])

  useEffect(() => {
    onSetPretty(pretty)
  }, [pretty, onSetPretty])

  return (
<fieldset>
  <legend>Input</legend>
  <div className="input-group vertical">
    <label htmlFor="privateKey">PrivateKey</label>
    <input type="text"
      autoFocus
      value={privateKey}
      pattern="[a-fA-F\d]+"
      maxLength={64}
      onChange={(_) => setPrivateKey(_.target.value)}
      onKeyPress={(_) => setPrivateKey(_.currentTarget.value)}
      placeholder=""
    />
    <p className="note"><small>Input PrivateKey or click Generate button.</small></p>
    <button
      className="primary"
      onClick={(_) => setPrivateKey(generateNewPrivateKey(networkType, vanity))}
    >Generate New Account</button>
  </div>

  <div>
    <input type="radio" id="mijin_test"
      name="networkType"
      onChange={() => setNetworkType(NetworkType.MIJIN_TEST)}
      checked={networkType === NetworkType.MIJIN_TEST}
    /><label htmlFor="mijin_test">MIJIN_TEST</label>
    <input type="radio" id="mijin"
      name="networkType"
      onChange={() => setNetworkType(NetworkType.MIJIN)}
      checked={networkType === NetworkType.MIJIN}
    /><label htmlFor="mijin">MIJIN</label>
    <input type="radio" id="main_net"
      name="networkType"
      onChange={() => setNetworkType(NetworkType.MAIN_NET)}
      checked={networkType === NetworkType.MAIN_NET}
    /><label htmlFor="main_net">MAIN_NET</label>
    <input type="radio" id="test_net"
      name="networkType"
      onChange={() => setNetworkType(NetworkType.TEST_NET)}
      checked={networkType === NetworkType.TEST_NET}
    /><label htmlFor="test_net">TEST_NET</label>
  </div>

  <div>
    <input type="radio" id="n"
      onChange={() => setVanity("N")}
      checked={vanity === "N"}
    /><label htmlFor="n">None</label>
    <input type="radio" id="a"
      onChange={() => setVanity("A")}
      checked={vanity === "A"}
    /><label htmlFor="a">A</label>
    <input type="radio" id="b"
      onChange={() => setVanity("B")}
      checked={vanity === "B"}
    /><label htmlFor="b">B</label>
    <input type="radio" id="a"
      onChange={() => setVanity("C")}
      checked={vanity === "C"}
    /><label htmlFor="c">C</label>
    <input type="radio" id="a"
      onChange={() => setVanity("D")}
      checked={vanity === "D"}
    /><label htmlFor="d">D</label>
  </div>

  <div>
    <input type="radio" id="pretty"
      onChange={() => setPretty(true)}
      checked={pretty}
    /><label htmlFor="pretty">Pretty</label>
    <input type="radio" id="plain"
      onChange={() => setPretty(false)}
      checked={!pretty}
    /><label htmlFor="plain">Plain</label>
  </div>
</fieldset>
  )
}

export default Input
