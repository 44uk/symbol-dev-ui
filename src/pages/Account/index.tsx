import React, { useState, useEffect, useContext } from "react"
import YAML from "yaml"
import clsx from "clsx"
import createPersistedState from "@plq/use-persisted-state"

import {
  GatewayContext,
  HttpContext,
  WebSockContext
} from "contexts"

import {
  IAccountData,
  useAccountData,
  ChannelName,
  Channels,
  useListener
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
  const webSockContext = useContext(WebSockContext)

  const [value, setValue] = useInputState(persistedPaths.account, query.identifier)
  const [selectedChannels, setSelectedChannels] = useInputState(persistedPaths.account + "/channels", [] as ChannelName[])

  const { accountHttp, mosaicHttp, metadataHttp, multisigHttp } = httpContext.httpInstance
  const { accountData, identifier, setIdentifier, handler, loading, error } = useAccountData({
    accountHttp,
    mosaicHttp,
    metadataHttp,
    multisigHttp
  }, query.identifier || value)

  const { listener } = webSockContext.webSockInstance
  const {
    log,
    setAddress,
    following, setFollowing,
    simple, setSimple
  } = useListener(
    listener,
    accountData && accountData.accountInfo.address,
    selectedChannels,
  )

  const [output, setOutput] = useState("")

  useEffect(() => {
    if(accountData) setOutput(stringifyAccountData(accountData))
    if(accountData) setAddress(accountData.accountInfo.address)
  }, [accountData])

  useEffect(() => {
    if(identifier) setValue(identifier)
  }, [identifier])

  const clsIsListening = clsx(
    following ? "secondary" : "primary"
  )

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

  <TextOutput
    label="Monitor"
    value={log}
    rows={16}
  ></TextOutput>
  <div className="input-group">
    { Object.values(Channels).map(key => (
      <label key={key}><input type="checkbox"
        disabled={following}
        checked={selectedChannels.includes(key as ChannelName)}
        onChange={_ => {
          const chan = key as ChannelName
          const tmpSet = new Set(selectedChannels)
          if(selectedChannels.includes(chan)) { tmpSet.delete(chan) } else { tmpSet.add(chan) }
          setSelectedChannels(channels => Array.from(tmpSet))
        }}
      /><small>{ key }</small></label>
    )) }
  </div>
  <div className="input-group">
    <label><input type="checkbox"
      disabled={following}
      checked={simple}
      onChange={_ => setSimple(!simple)}
    /><small>Simplify</small></label>
    <button className={clsIsListening}
      disabled={selectedChannels.length === 0}
      onClick={() => setFollowing(!following)}
    >{ following ? "Stop" : "Start" }</button>
  </div>
</div>
  )
}

export default Account
