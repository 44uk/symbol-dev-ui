import React, { useEffect, useState, useContext } from 'react';
import createPersistedState from 'use-persisted-state'
import {
  gateways,
  Context as GatewayContext
} from 'contexts/gateway'

const useGatewayListState = createPersistedState('gateway-list')

interface IProps {
  onAvailable?: () => void
}

export const GatewaySelector: React.FC = (
  onAvailable
) => {
  const gwContext = useContext(GatewayContext)
  const [gwList] = useGatewayListState(gateways)
  const [availability, setAvailability] = useState(false)

  useEffect(() => {
    const url = `${gwContext.url}/node/info`
    setAvailability(false)
    fetch(url)
      .then(resp => resp.json())
      .then(_ => setAvailability(true))
      .catch(error => {
        console.error(error)
        setAvailability(false)
      })
      .finally(() => 0)
  }, [gwContext.url])

  return (
<div className="col-sm">
  <select
    value={gwContext.url}
    onChange={(ev) => { gwContext.changeUrl(ev.target.value) } }
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

export default GatewaySelector;
