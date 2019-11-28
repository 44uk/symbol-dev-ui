import { useState, useEffect } from "react"
import { TransactionHttp, TransactionStatus, Transaction } from "nem2-sdk"
import { forkJoin } from "rxjs"
import { map } from "rxjs/operators"

export interface ITransactionData {
  transaction: Transaction
  effectiveFee: number
  transactionStatus: TransactionStatus
}

interface IHttpInstance {
  transactionHttp: TransactionHttp
}

export const useTransactionData = (httpInstance: IHttpInstance) => {
  const [transactionData, setTransactionData] = useState<ITransactionData | null>(null)
  const [identifier, setIdentifier] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { transactionHttp  } = httpInstance

  const handler = () => {
    if(! (identifier && /([0-9A-Z]{64}|)/.test(identifier))) return

    setLoading(true)
    forkJoin([
      transactionHttp.getTransaction(identifier),
      transactionHttp.getTransactionEffectiveFee(identifier),
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
        data =>  setTransactionData(data),
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
  }

  useEffect(handler, [identifier, transactionHttp])

  return { transactionData, identifier, setIdentifier, handler, loading, error }
}
