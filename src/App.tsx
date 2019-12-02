import React, { useEffect, useState, useRef } from "react"
import { NetworkType } from "nem2-sdk"

import {
  Nav,
  Content,
  GatewaySelector
} from "components"
import {
  GATEWAY_LIST,
  GatewayContext,
  createHttpInstance,
  HttpContext,
  createWebSockInstance,
  WebSockContext,
} from "contexts"

import { persistedPaths } from "persisted-paths"
import createPersistedState from "use-persisted-state"

const useGatewayListState = createPersistedState(persistedPaths.gatewayList)
const useCurrentGatewayState = createPersistedState(persistedPaths.currentGateway)

const App: React.FC = () => {
  const [urlList, setUrlList] = useGatewayListState(GATEWAY_LIST)
  const [gw, setGw] = useCurrentGatewayState(urlList[0])

  const [url, setUrl] = useState(gw)
  const [networkType, setNetworkType] = useState<number>(NetworkType.MIJIN_TEST)
  const [genHash, setGenHash] = useState<string>("")
  const setGwRef = useRef(setGw)
  const gwContextValue = {
    urlList, setUrlList,
    url, setUrl,
    genHash, setGenHash,
    networkType, setNetworkType
  }
  useEffect(() => {
    setGwRef.current(url)
  }, [url])

  const httpContextValue = {
    url, httpInstance: createHttpInstance(url)
  }

  const webSockContextValue = {
    url, webSockInstance: createWebSockInstance(url)
  }

  return (
<GatewayContext.Provider value={gwContextValue}>
<HttpContext.Provider value={httpContextValue}>
<WebSockContext.Provider value={webSockContextValue}>
  <div className="container">
    <GatewaySelector></GatewaySelector>
    <Nav></Nav>
    <main>
      <Content></Content>
    </main>
  </div>
</WebSockContext.Provider>
</HttpContext.Provider>
</GatewayContext.Provider>
  )
}

export default App
