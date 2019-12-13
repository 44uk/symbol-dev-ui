import { useEffect, useState, useCallback } from "react"
import { NetworkType } from "nem2-sdk"
import { forkJoin, from, Observable } from "rxjs"
import { map } from "rxjs/operators"
import createPersistedState from "@plq/use-persisted-state"
import { persistedPaths } from "persisted-paths"

import { ILayer } from "util/graph2tree"
import {
  createAddressFromIdentifier
} from "util/convert"

const [usePersistedState] = createPersistedState(persistedPaths.app)

export interface IMultisigData {
  graphInfo: ILayer[]
}

export const useMultisigData = (url: string, initialValue: string = "", networkType = NetworkType.MIJIN_TEST) => {
  const [multisigData, setMultisigData] = useState<IMultisigData | null>(null)
  const [identifier, setIdentifier] = usePersistedState(persistedPaths.mlms, initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getJSON = <T>(url: string): Observable<T> => {
    return from(fetch(url)
      .then(resp => { if(resp.ok) { return resp } else { throw new Error(resp.statusText) } })
      .then<T>(resp => resp.json())
    )
  }

  const handler = useCallback(() => {
    if(! identifier) return
    const address = createAddressFromIdentifier(identifier, networkType)
    if(! address) return

    setLoading(true)
    forkJoin([
      getJSON<ILayer[]>(`${url}/account/${address.plain()}/multisig/graph`)
    ])
      .pipe(
        map(resp => ({
          graphInfo: resp[0],
        }))
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
  }, [identifier, url, networkType, setMultisigData])

  useEffect(handler, [identifier, url])

  return { multisigData, identifier, setIdentifier, handler, loading, error }
}
