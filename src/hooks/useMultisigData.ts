import { useEffect, useState } from "react"
import { NetworkType, Address, AccountHttp, MultisigAccountGraphInfo } from "nem2-sdk";
import { forkJoin } from "rxjs";
import { map, tap } from "rxjs/operators";

import {
  ILayer,
} from "util/graph2tree"

function createAddressFromIdentifier(value: string, networkType = NetworkType.MIJIN_TEST) {
  try {
    return /^[SMTN][0-9A-Z-]{39,45}$/.test(value)
      ? Address.createFromRawAddress(value)
      : Address.createFromPublicKey(value, networkType)
    ;
  } catch(error) {
    return null
  }
}

export interface IMultisigData {
  graphInfo: ILayer[]
}

// interface IHttpInstance {
//   accountHttp: AccountHttp
// }

export const useMultisigData = (url: string) => {
  const [identifier, setIdentifier] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [multisigData, setMultisigData] = useState<IMultisigData | null>(null)

  function getJSON<T>(url: string): Promise<T> {
    return fetch(url).then<T>(resp => resp.json())
  }

  useEffect(() => {
    if(! identifier) return
    const address = createAddressFromIdentifier(identifier)
    if(! address) return

    setLoading(true)
    forkJoin([
      getJSON<ILayer[]>(`${url}/account/${address.plain()}/multisig/graph`)
    ])
      .pipe(
        map(resp => ({
          graphInfo: resp[0],
        }))
        ,tap(console.debug)
      )
      .subscribe(
        setMultisigData,
        (error) => {
          setLoading(false)
          setError(error)
          setMultisigData(null)
        },
        () => {
          setLoading(false)
          setError(null)
        }
      )
  }, [identifier, url])

  return { multisigData, setIdentifier, loading, error }
}
