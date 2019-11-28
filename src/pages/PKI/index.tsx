import React, { useState, useEffect } from "react"
import createPersistedState from "use-persisted-state"

import {
  Account,
} from "nem2-sdk"

import Input from "./Input"
import Output from "./Output"

const useGeneratedKeyListState = createPersistedState("generated-key-list")

export const PKI: React.FC = () => {
  const [account, setAccount] = useState<Account | null>(null)
  const [pretty, setPretty] = useState(false)
  const [generatedKeyList, setGeneratedKeyList] = useGeneratedKeyListState<string[]>([])

  useEffect(() => {
    if(account === null) { return }
    const newPrivateKeys = [account.privateKey].concat(generatedKeyList)
    setGeneratedKeyList(newPrivateKeys)
  }, [account])

  return (
  <div>
    <Input
      onSetAccount={setAccount}
      onSetPretty={setPretty}
    />
    <Output
      account={account}
      pretty={pretty}
    />

    <div>
      { false && generatedKeyList.map(key => (
        <div key={key}
        >{key}</div>
      ))}
    </div>
  </div>
  )
}

export default PKI
