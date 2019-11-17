import { useEffect, useState } from "react"
import { NamespaceHttp, NamespaceId, NamespaceInfo, MetadataHttp, Metadata } from "nem2-sdk";
import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";

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
}

interface IHttpInstance {
  namespaceHttp: NamespaceHttp,
  metadataHttp: MetadataHttp
}

export const useNamespaceData = (httpInstance: IHttpInstance) => {
  const [namespaceData, setNamespaceData] = useState<INamespaceData | null>(null)
  const [identifier, setIdentifier] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { namespaceHttp, metadataHttp } = httpInstance

  useEffect(() => {
    if(! identifier) return
    const nsId = createNsIdFromIdentifier(identifier)
    if(! nsId) return

    setLoading(true)
    forkJoin([
      namespaceHttp.getNamespace(nsId),
      metadataHttp.getNamespaceMetadata(nsId)
    ])
      .pipe(
        map(resp => ({
          namespaceInfo: resp[0],
          metadata: resp[1]
        }))
      )
      .subscribe(
        data => setNamespaceData(data),
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

  return { namespaceData, setIdentifier, loading, error }
}
