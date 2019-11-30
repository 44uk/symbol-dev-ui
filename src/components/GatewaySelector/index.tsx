import React, { useEffect, useState, useContext } from "react"
import { GatewayContext } from "contexts"
import { NetworkType } from "nem2-sdk"
import { forkJoin, from } from "rxjs"
import { map } from "rxjs/operators"

interface IProps {
  onAvailable?: () => void
}

export const GatewaySelector: React.FC<IProps> = (
  onAvailable
) => {
  const gwContext = useContext(GatewayContext)
  const {
    setUrl,
    setGenHash,
    setNetworkType
  } = gwContext

  const [network, setNetwork] = useState("")
  const [available, setAvailability] = useState(false)

  useEffect(() => {
    const nodeInfoUrl = `${gwContext.url}/node/info`
    const blockInfoUrl = `${gwContext.url}/block/1`
    setAvailability(false)

    forkJoin([
      from(fetch(nodeInfoUrl).then(_ => _.json())),
      from(fetch(blockInfoUrl).then(_ => _.json())),
    ])
      .pipe(
        map(resp => ({ node: resp[0], block: resp[1] })),
      )
      .subscribe(
        ({ node, block }) => {
          setGenHash(block.meta.generationHash)
          setNetworkType(node.networkIdentifier)
          setNetwork(NetworkType[node.networkIdentifier])
          setAvailability(true)
        },
        error => {
          console.error(error)
          setAvailability(false)
        }
      )

    // from(fetch(nodeInfoUrl)
    //   .then(resp => resp.json())
    //   .then(resp => {
    //     setNetworkType(resp.networkIdentifier)
    //     setNetwork(NetworkType[resp.networkIdentifier])
    //     setAvailability(true)
    //   })
    //   .catch(error => {
    //     console.error(error)
    //     setAvailability(false)
    //   })
    //   .finally(() => 0)
  }, [gwContext.url, setGenHash, setNetworkType])

  return (
<div className="col-sm">
  <select
    value={gwContext.url}
    onChange={(ev) => { setUrl(ev.target.value) } }
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
}

export default GatewaySelector
