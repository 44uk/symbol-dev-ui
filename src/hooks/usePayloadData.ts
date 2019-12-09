import { useState, useEffect } from "react"
import { Transaction, TransactionMapping } from "nem2-sdk"
import createPersistedState from "@plq/use-persisted-state"
import { persistedPaths } from "persisted-paths"

const [usePersistedState] = createPersistedState(persistedPaths.app)

export const usePayloadData = (initialValue: string) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [payload, setPayload] = usePersistedState(persistedPaths.payload, initialValue)
  const [error, setError] = useState<Error | null>(null)

  const handler = () => {
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
  }

  useEffect(handler, [payload])

  return { transaction, payload, setPayload, error }
}
