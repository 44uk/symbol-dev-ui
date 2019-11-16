import { useEffect, useState, useRef } from "react"
import { NetworkType, Address, AccountHttp, AccountInfo } from "nem2-sdk";
import { catchError, tap } from "rxjs/operators";

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

export const useAccountInfo = (http: AccountHttp) => {
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [identifier, setIdentifier] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if(! identifier) return
    const address = createAddressFromIdentifier(identifier)
    if(! address) return
    setLoading(true)

    http.getAccountInfo(address)
      .pipe(
        tap(setAccountInfo)
      )
      .subscribe(
        setAccountInfo,
        (error) => {
          setLoading(false)
          setError(error)
          setAccountInfo(null)
        },
        () => setLoading(false)
      )
  }, [identifier])

  return { accountInfo, setIdentifier, loading, error }
}
