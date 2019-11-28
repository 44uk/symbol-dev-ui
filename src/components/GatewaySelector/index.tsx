import React, { useEffect, useState, useContext } from 'react';
import { Context as GatewayContext } from 'contexts/gateway'
import { NetworkType } from 'nem2-sdk';

interface IProps {
  onAvailable?: () => void
}

export const GatewaySelector: React.FC<IProps> = (
  onAvailable
) => {
  const gwContext = useContext(GatewayContext)
  const [network, setNetwork] = useState("")
  const [available, setAvailability] = useState(false)

  useEffect(() => {
    const url = `${gwContext.url}/node/info`
    setAvailability(false)
    fetch(url)
      .then(resp => resp.json())
      .then(resp => {
        setNetwork(NetworkType[resp.networkIdentifier])
        setAvailability(true)
      })
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
    {gwContext.urlList.map((n: string) => (
      <option key={n} value={n} >{n}</option>
    ))}
  </select>
  { available ?
    <span>Active!({network})</span> :
    <span>InActive!</span>
  }
</div>
  )
};

export default GatewaySelector;
