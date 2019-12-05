import { useState, useEffect } from "react"
import { BlockHttp, BlockInfo, Statement, ReceiptHttp } from "nem2-sdk"
import { forkJoin } from "rxjs"
import { map } from "rxjs/operators"

export interface IBlockData {
  blockInfo: BlockInfo
  receipt: Statement
}

interface IHttpInstance {
  blockHttp: BlockHttp
  receiptHttp: ReceiptHttp
}

export const useBlockData = (httpInstance: IHttpInstance, initialValue: string | null = null) => {
  const [blockData, setBlockData] = useState<IBlockData | null>(null)
  const [height, setHeight] = useState<string | null>(initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const { blockHttp, receiptHttp } = httpInstance

  const handler = () => {
    if(! height) return

    setLoading(true)
    forkJoin([
      blockHttp.getBlockByHeight(height.toString()),
      receiptHttp.getBlockReceipts(height.toString())
    ])
      .pipe(
        map(resp => ({
          blockInfo: resp[0],
          receipt: resp[1]
        }))
      )
      .subscribe(
        setBlockData,
        (error) => {
          setLoading(false)
          setError(error)
          setBlockData(null)
        },
        () => {
          setLoading(false)
          setError(null)
        }
      )
  }

  useEffect(handler, [height, blockHttp])

  return { blockData, height, setHeight, handler, loading, error }
}
