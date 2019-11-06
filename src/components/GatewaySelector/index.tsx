import React, { useEffect, useState } from 'react';
import createPersistedState from 'use-persisted-state'
import GATEWAY_LIST from 'resources/gateway.json'

const useCurrentGatewayState = createPersistedState('current-node')
const useGatewayListState = createPersistedState('gateway-list')

interface IProps {
  onAvailable?: () => void
}

export const NodeSelector: React.FC = (
  onAvailable
) => {
  const [gwList] = useGatewayListState(GATEWAY_LIST)
  const [gw, setGw] = useCurrentGatewayState(GATEWAY_LIST[0])
  const [availability, setAvailability] = useState(false)

  useEffect(() => {
    const url = `${gw}/chain/height`
    console.debug(url)
    setAvailability(false)
    fetch(url)
      .then(resp => {
        console.debug(resp)
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
