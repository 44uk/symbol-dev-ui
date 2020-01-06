import { useState, useEffect, useCallback } from "react"
import { Transaction, TransactionMapping, NetworkType, TransactionHttp, SignedTransaction } from "nem2-sdk"
import createPersistedState from "@plq/use-persisted-state"
import { persistedPaths } from "persisted-paths"

const [usePersistedState] = createPersistedState(persistedPaths.app)

interface IHttpInstance {
  transactionHttp: TransactionHttp
}

export const usePayloadData = (
  initialValue: string,
  httpInstance: IHttpInstance,
  networkType: NetworkType,
  genHash: string
) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [payload, setPayload] = usePersistedState(persistedPaths.payload, initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const { transactionHttp } = httpInstance

  const announce = useCallback(() => {
    if(error) return
    setLoading(true)
    // XXX: Workaround
    transactionHttp.announce({ payload } as SignedTransaction)
      .subscribe(
        resp => {
          setLoading(false)
        },
        error => console.error(error),
        () => {
          setLoading(false)
          setError(null)
        }
      )
  }, [payload, error, transactionHttp])

  const handler = useCallback(() => {
    if(! payload) return
    try {
      if(payload && /^([0-9A-F][0-9A-F])+$/.test(payload)) {
        const transaction = TransactionMapping.createFromPayload(payload)
        setTransaction(transaction)
        setError(null)
      } else {
        throw new Error("Invalid Transaction Payload")
      }
    } catch(error) {
      setError(error)
      setTransaction(null)
    }
  }, [payload])

  useEffect(handler, [payload])

  return { transaction, payload, setPayload, announce, loading, error }
}
