import React, { useState, useEffect, useContext, useCallback, useMemo } from "react"
import YAML from "yaml"

import clsx from "clsx"
import createPersistedState from "@plq/use-persisted-state"
import { persistedPaths } from "persisted-paths"

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

import { TextOutput } from "components"
import Input from "./Input"

const [usePersistedState] = createPersistedState(persistedPaths.app)

function stringifyAccountData(data: IAccountData) {
  return YAML.stringify(data)
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

  const [selectedChannels, setSelectedChannels] = usePersistedState(persistedPaths.account + "/channels", [] as ChannelName[])

  const { accountHttp, mosaicHttp, namespaceHttp, metadataHttp, multisigHttp } = httpContext.httpInstance
  const { accountData, identifier, setIdentifier, handler, loading, error } = useAccountData({
    accountHttp,
    mosaicHttp,
    namespaceHttp,
    metadataHttp,
    multisigHttp
  }, query.identifier || "")

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

  const submit = useCallback(() => {
    handler()
  }, [handler])

  const clsIsListening = useMemo(() => (clsx(
    following ? "secondary" : "primary"
  )), [following])

  useEffect(() => {
    if(accountData) setOutput(stringifyAccountData(accountData))
    if(accountData) setAddress(accountData.accountInfo.address)
  }, [accountData])

  return (
<div>
  <Input
    url={gwContext.url}
    identifier={identifier}
    setIdentifer={setIdentifier}
    onSubmit={submit}
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
