import React, { useState } from 'react';
import createPersistedState from 'use-persisted-state'
import GATEWAY_LIST from 'resources/gateway.json'

const useGatewayListState = createPersistedState('gateway-list')
const useGeneratedKeyListState = createPersistedState('generated-key-list')

export const Config: React.FC = () => {
  const [gwList, setGwList] = useGatewayListState(GATEWAY_LIST)
  const [, setGeneratedKeyList] = useGeneratedKeyListState<string[]>([])
  const [gwText, setGwText] = useState(gwList.join("\n"))

  function resetPersistedState() {
    setGwList(GATEWAY_LIST)
    setGwText(GATEWAY_LIST.join("\n"))
    setGeneratedKeyList([])
  }

  function saveGatewayList() {
    const _tmp = gwText.split("\n")
      .map((line) => line.trim())
      .filter((line) => /https?:\/\/.+?/.test(line))
    const gwList = Array.from(new Set(_tmp))
    setGwList(gwList)
    setGwText(gwList.join("\n"))
  }

  return (
<div>
  <fieldset>
    <legend>Gateway URLs</legend>
    <div className="input-group vertical">
      <textarea rows={6} value={gwText} onChange={(_) => setGwText(_.target.value)}></textarea>
      <p className="note"><small>Put gateway url lines. ex) http://localhost:3000</small></p>
      <button className="primary" onClick={() => saveGatewayList()}>Save</button>
    </div>
  </fieldset>

  <fieldset>
    <legend>LocalStorage Data</legend>
    <div className="input-group vertical">
      <button className="primary" onClick={() => resetPersistedState()}>Clear</button>
      <p className="note"><small>Reset App Configuration.</small></p>
    </div>
  </fieldset>
</div>
  );
}

export default Config;
