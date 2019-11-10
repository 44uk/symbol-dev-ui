import GATEWAY_LIST from 'resources/gateway.json'
import React, { useEffect, useState } from 'react';
import createPersistedState from 'use-persisted-state'

const useCurrentGatewayState = createPersistedState('current-gateway')
const useGatewayListState = createPersistedState('gateway-list')

interface IProps {
  onAvailable?: () => void
}

interface INodeInfo {

}

export const NodeSelector: React.FC = (
  onAvailable
) => {
  const [gw, setGw] = useCurrentGatewayState(GATEWAY_LIST[0])
  const [gwList] = useGatewayListState(GATEWAY_LIST)
  const [availability, setAvailability] = useState(false)

  useEffect(() => {
    const url = `${gw}/node/info`
    setAvailability(false)
    fetch(url)
      .then(resp => resp.json())
      .then(resp => {
        // console.debug(resp.networkIdentifier)
        setAvailability(true)
      })
      .catch(error => {
        console.error(error)
        setAvailability(false)
      })
      .finally(() => 0)
  }, [gw])

  return (
<div className="col-sm">
  <select
    value={gw}
    onChange={(ev) => setGw(ev.target.value)}
  >
    {gwList.map((n: string) => (
      <option key={n} value={n} >{n}</option>
    ))}
  </select>
  { availability ?
    <span>Active!</span> :
    <span>InActive!</span>
  }
</div>
  )
};

export default NodeSelector;
