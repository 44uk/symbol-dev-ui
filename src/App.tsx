import React, { useEffect, useState, useRef } from 'react';

import createPersistedState from 'use-persisted-state'

import Nav from 'components/Nav';
import Content from 'components/Content';
import GatewaySelector from 'components/GatewaySelector';

import {
  gateways,
  Context as GatewayContext
} from 'contexts/gateway'

const useGatewayListState = createPersistedState('gateway-list')
const useCurrentGatewayState = createPersistedState('current-gateway')

const App: React.FC = () => {
  const [urlList, setUrlList] = useGatewayListState(gateways)
  const [gw, setGw] = useCurrentGatewayState(urlList[0])
  const [url, changeUrl] = useState(gw)
  const setGwRef = useRef(setGw)
  const gwContextValue = {
    url,
    changeUrl,
    urlList,
    setUrlList
  }
  useEffect(() => {
    setGwRef.current(url)
  }, [url])

  return (
<GatewayContext.Provider value={gwContextValue}>
  <div className="container">
    <GatewaySelector></GatewaySelector>
    <Nav></Nav>
    <main>
      <Content></Content>
    </main>
  </div>
</GatewayContext.Provider>
  );
}

export default App;
