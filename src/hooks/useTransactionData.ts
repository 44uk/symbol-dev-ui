import { useState, useEffect, useCallback } from "react"
import { TransactionHttp, TransactionStatus, Transaction } from "nem2-sdk"
import { forkJoin, of } from "rxjs"
import { map, catchError } from "rxjs/operators"
import createPersistedState from "@plq/use-persisted-state"
import { persistedPaths } from "persisted-paths"

const [usePersistedState] = createPersistedState(persistedPaths.app)

export interface ITransactionData {
  transaction: Transaction | null
  effectiveFee: number | null
  transactionStatus: TransactionStatus
}

interface IHttpInstance {
  transactionHttp: TransactionHttp
}

export const useTransactionData = (httpInstance: IHttpInstance, initialValue: string = "") => {
  const [transactionData, setTransactionData] = useState<ITransactionData | null>(null)
  const [identifier, setIdentifier] = usePersistedState(persistedPaths.transaction, initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { transactionHttp  } = httpInstance

  const handler = useCallback(() => {
    if(! (identifier && /[0-9A-Z]{64}/.test(identifier))) return

    setLoading(true)
    forkJoin([
      transactionHttp.getTransaction(identifier).pipe(catchError(() => of(null))),
      transactionHttp.getTransactionEffectiveFee(identifier).pipe(catchError(() => of(null))),
      transactionHttp.getTransactionStatus(identifier)
    ])
      .pipe(
        map(resp => ({
          transaction: resp[0],
          effectiveFee: resp[1],
          transactionStatus: resp[2],
        }))
      )
      .subscribe(
        setTransactionData,
        (error) => {
          setLoading(false)
          setError(error)
          setTransactionData(null)
        },
        () => {
          setLoading(false)
          setError(null)
        }
      )
  }, [identifier, transactionHttp])

  useEffect(handler, [identifier, transactionHttp])

  return { transactionData, identifier, setIdentifier, handler, loading, error }
}
