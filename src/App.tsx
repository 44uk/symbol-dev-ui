import React, { useEffect, useState, useRef } from "react"
import {
  Nav,
  Content,
  GatewaySelector
} from "components"
import {
  gateways,
  Context as GatewayContext
} from "contexts/gateway"
import {
  createHttpInstance,
  Context as HttpContext
} from "contexts/http"
import {
  createWebSockInstance,
  Context as WebSockContext
} from "contexts/websock"
import createPersistedState from "use-persisted-state"
import { NetworkType } from "nem2-sdk"

const useGatewayListState = createPersistedState("gateway-list")
const useCurrentGatewayState = createPersistedState("current-gateway")

const App: React.FC = () => {
  const [urlList, setUrlList] = useGatewayListState(gateways)
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
    url,
    httpInstance: createHttpInstance(url)
  }
  const webSockContextValue = {
    url,
    webSockInstance: createWebSockInstance(url)
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
