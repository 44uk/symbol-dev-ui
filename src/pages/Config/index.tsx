import React, { useState, useContext } from "react"
import createPersistedState from "@plq/use-persisted-state"

import {
  GATEWAY_LIST,
  GatewayContext
} from "contexts"

import { persistedPaths } from "persisted-paths"

const [, clearPersistedState] = createPersistedState(persistedPaths.app)

export const Config: React.FC = () => {
  const gwContext = useContext(GatewayContext)
  const [gwText, setGwText] = useState(gwContext.urlList.join("\n"))

  function resetGatewayState() {
    gwContext.setUrlList([])
    setGwText(GATEWAY_LIST.join("\n"))
  }

  function resetPersistedState() {
    clearPersistedState()
  }

  function saveGatewayList() {
    const _tmp = gwText.split("\n")
      .map((line) => line.trim())
      .filter((line) => /https?:\/\/.+?/.test(line))
    const gwList = Array.from(new Set(_tmp))
    gwContext.setUrlList(gwList)
    setGwText(gwList.join("\n"))
  }

  return (
<div>
  <fieldset>
    <legend>Gateway URLs</legend>
    <div className="input-group vertical">
      <textarea rows={6} value={gwText} onChange={_ => setGwText(_.target.value)}></textarea>
      <p className="note"><small>Put gateway url lines. ex) http://localhost:3000</small></p>
      <button className="primary" onClick={() => saveGatewayList()}>Save</button>
    </div>
  </fieldset>

  <fieldset>
    <legend>App Persisted Data</legend>
    <div className="input-group vertical">
      <button className="primary" onClick={() => resetGatewayState()}>Reset</button>
      <p className="note"><small>Reset Gateway URLs.</small></p>
    </div>
    <div className="input-group vertical">
      <button className="primary" onClick={() => resetPersistedState()}>Clear</button>
      <p className="note"><small>Reset all application state.</small></p>
    </div>
  </fieldset>
</div>
  )
}

export default Config
