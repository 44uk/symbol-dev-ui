import React, { useState, useEffect, useContext } from "react"
import YAML from "yaml"
import createPersistedState from "@plq/use-persisted-state"

import {
  GatewayContext,
  HttpContext
} from "contexts"

import {
  IAccountData,
  useAccountData
} from "hooks"

import { persistedPaths } from "persisted-paths"
import { TextOutput } from "components"
import Input from "./Input"

const [useInputState] = createPersistedState(persistedPaths.app)

function stringifyAccountData(data: IAccountData) {
  return YAML.stringify(data)
//   const {
//     accountInfo: ai,
//     metadata: md,
//     mosaicAmountViews: mav,
//     multisigAccountInfo: mai
//   } = data
//   return `Info:
//   Address: ${ai.address.plain()}
//   HexAddress: ${ai.address.encoded()}
//     Height at: ${ai.addressHeight}
//   PublicKey: ${ai.publicKey}
//     Height at: ${ai.publicKeyHeight}
//   Importance: ${ai.importance}
//     Height at: ${ai.importanceHeight}
// Metadata:
// ${md.map(d => "  - " + d.metadataEntry.value).join("\n")}
// Mosaics:
// ${mav.map(v => "  - " + `${v.fullName()}:${v.relativeAmount()}`).join("\n")}
// `
}

interface IProps {
  query: {
    identifier?: string
  }
}

export const Account: React.FC<IProps> = ({ query }) => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)

  const [value, setValue] = useInputState(persistedPaths.account, query.identifier)

  const { accountHttp, mosaicHttp, metadataHttp, multisigHttp } = httpContext.httpInstance
  const { accountData, identifier, setIdentifier, handler, loading, error } = useAccountData({
    accountHttp,
    mosaicHttp,
    metadataHttp,
    multisigHttp
  }, query.identifier || value)

  const [output, setOutput] = useState("")

  useEffect(() => {
    if(accountData) setOutput(stringifyAccountData(accountData))
  }, [accountData])

  useEffect(() => {
    if(identifier) setValue(identifier)
  }, [identifier])

  return (
<div>
  <Input
    url={gwContext.url}
    onSubmit={setIdentifier}
    onChange={(value) => setValue(value)}
    identifier={identifier}
    handler={handler}
  ></Input>

  <TextOutput
    label="Account Data"
    value={output}
    loading={loading}
    error={error}
  ></TextOutput>
</div>
  )
}

export default Account
