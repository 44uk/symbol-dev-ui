import React, { useState, useEffect } from "react"

import {
  Account,
} from "nem2-sdk"

import Input from "./Input"
import Output from "./Output"

export const PKI: React.FC = () => {
  const [account, setAccount] = useState<Account | null>(null)
  const [pretty, setPretty] = useState(false)

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
  </div>
  )
}

export default PKI
