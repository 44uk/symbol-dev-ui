import { useEffect, useState } from "react"
import { NamespaceHttp, NamespaceId, NamespaceInfo } from "nem2-sdk";
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
}

export const useNamespaceData = (http: NamespaceHttp) => {
  const [namespaceData, setNamespaceData] = useState<INamespaceData | null>(null)
  const [identifier, setIdentifier] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if(! identifier) return
    const nsId = createNsIdFromIdentifier(identifier)
    if(! nsId) return

    setLoading(true)
    forkJoin([
      http.getNamespace(nsId)
    ])
      .pipe(
        map(resp => ({
          namespaceInfo: resp[0]
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
  }, [identifier])

  return { namespaceData, setIdentifier, loading, error }
}
