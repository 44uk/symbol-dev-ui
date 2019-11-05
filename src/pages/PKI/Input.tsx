import React, { useState, useEffect } from 'react';

import {
  Account,
  NetworkType
} from 'nem2-sdk'

interface IProps {
  onSetAccount: React.Dispatch<React.SetStateAction<Account | undefined>>
  onSetPretty: React.Dispatch<React.SetStateAction<boolean>>
}

function generateNewPrivateKey(networkType = NetworkType.MIJIN_TEST) {
  return Account.generateNewAccount(networkType).privateKey
}

function generateNewAccount(networkType = NetworkType.MIJIN_TEST, str?: string) {
  let account: Account | undefined = undefined;
  if(str) {
    try {
      account = Account.createFromPrivateKey(str, networkType)
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
  onSetPretty
}) => {
  // const [account, setAccount] = useState<Account | undefined>(undefined)
  const [privateKey, setPrivateKey] = useState('')
  const [networkType, setNetworkType] = useState(NetworkType.MIJIN_TEST)
  const [pretty, setPretty] = useState(true)

 // useEffect(() => {
 //   if(account === undefined) { return; }
 //   setPrivateKey(account.privateKey)
 // }, [account])

  useEffect(() => {
    if(privateKey.length > 0) {
      const newAccount = generateNewAccount(networkType, privateKey)
      // setAccount(newAccount)
      onSetAccount(newAccount)
    }
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
      value={privateKey || ''}
      pattern="[a-fA-F\d]+"
      maxLength={64}
      onChange={(_) => setPrivateKey(_.target.value)}
      onKeyPress={(_) => setPrivateKey(_.currentTarget.value)}
      placeholder=""
    />
    <p className="note"><small>Input PrivateKey or click Generate button.</small></p>
    <button
      className="primary"
      onClick={(_) => setPrivateKey(generateNewPrivateKey(networkType))}
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

export default Input;
