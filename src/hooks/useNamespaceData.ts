import { useState, useCallback } from "react"
import { NamespaceHttp, NamespaceId, NamespaceInfo, MetadataHttp, Metadata, MosaicId, Address } from "nem2-sdk"
import { forkJoin, of } from "rxjs"
import { map, catchError } from "rxjs/operators"
import useDebouncedEffect  from "use-debounced-effect"
import createPersistedState from "@plq/use-persisted-state"
import { persistedPaths } from "persisted-paths"

const [usePersistedState] = createPersistedState(persistedPaths.app)

function createNsIdFromIdentifier(value: string) {
  try {
    return new NamespaceId(value)
  } catch(error) {
    // for continuing if value is not namespace name string
  }
  try {
    return NamespaceId.createFromEncoded(value)
  } catch(error) {
    return null
  }
}

export interface INamespaceData {
  namespaceInfo: NamespaceInfo
  metadata: Metadata[]
  mosaicId: MosaicId | null
  address: Address | null
}

interface IHttpInstance {
  namespaceHttp: NamespaceHttp,
  metadataHttp: MetadataHttp
}

export const useNamespaceData = (httpInstance: IHttpInstance, initialValue: string = "") => {
  const [namespaceData, setNamespaceData] = useState<INamespaceData | null>(null)
  const [identifier, setIdentifier] = usePersistedState(persistedPaths.namespace, initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { namespaceHttp, metadataHttp } = httpInstance

  const handler = useCallback(() => {
    // if(! /[a-z0-9'_\-\.]{1,64}/.test(identifier)) return
    if(! identifier) return
    const nsId = createNsIdFromIdentifier(identifier)
    if(! nsId) return

    setLoading(true)
    forkJoin([
      namespaceHttp.getNamespace(nsId),
      metadataHttp.getNamespaceMetadata(nsId),
      namespaceHttp.getLinkedMosaicId(nsId).pipe(catchError(()=> of(null))),
      namespaceHttp.getLinkedAddress(nsId).pipe(catchError(()=> of(null)))
    ])
      .pipe(
        map(resp => ({
          namespaceInfo: resp[0],
          metadata: resp[1],
          mosaicId: resp[2],
          address: resp[3]
        }))
      )
      .subscribe(
        setNamespaceData,
        (error) => {
          setLoading(false)
          setError(error)
          setNamespaceData(null)
        },
        () => {
          setLoading(false)
          setError(null)
        }
      )
  }, [identifier, namespaceHttp, metadataHttp])

  useDebouncedEffect(handler, 500, [identifier, namespaceHttp, metadataHttp])

  return { namespaceData, identifier, setIdentifier, handler, loading, error }
}
