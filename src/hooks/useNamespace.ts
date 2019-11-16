import { useEffect, useState } from "react"
import { NetworkType, Address, AccountHttp, AccountInfo, Namespace, NamespaceHttp, NamespaceId, NamespaceInfo } from "nem2-sdk";

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

export const useNamespace = (http: NamespaceHttp) => {
  const [namespaceInfo, setNamespaceInfo] = useState<NamespaceInfo | null>(null)
  const [identifier, setIdentifier] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if(! identifier) return
    const nsId = NamespaceId.createFromEncoded(identifier)
    if(! nsId) return

    setLoading(true)
    http.getNamespace(nsId)
      .subscribe(
        resp => setNamespaceInfo(resp),
        error => setError(error),
        () => setLoading(false)
      )
  }, [identifier])

  return { namespaceInfo, setIdentifier, loading, error }
}
