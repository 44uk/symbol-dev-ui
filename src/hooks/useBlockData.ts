import { useState, useCallback } from "react"
import { BlockHttp, BlockInfo, Statement, ReceiptHttp } from "nem2-sdk"
import { forkJoin } from "rxjs"
import { map } from "rxjs/operators"
// import useDebouncedEffect  from "use-debounced-effect"
import createPersistedState from "@plq/use-persisted-state"
import { persistedPaths } from "persisted-paths"

const [usePersistedState] = createPersistedState(persistedPaths.app)

export interface IBlockData {
  blockInfo: BlockInfo
  receipt: Statement
}

interface IHttpInstance {
  blockHttp: BlockHttp
  receiptHttp: ReceiptHttp
}

export const useBlockData = (httpInstance: IHttpInstance, initialValue: string = "") => {
  const [blockData, setBlockData] = useState<IBlockData | null>(null)
  const [height, setHeight] = usePersistedState(persistedPaths.block, initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const { blockHttp, receiptHttp } = httpInstance

  const handler = useCallback(() => {
    if(! /^[1-9][0-9]*$/.test(height)) return

    setLoading(true)
    forkJoin([
      blockHttp.getBlockByHeight(height),
      receiptHttp.getBlockReceipts(height)
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
  }, [height, blockHttp, receiptHttp])

  // useEffect(handler, [height, blockHttp])

  return { blockData, height, setHeight, handler, loading, error }
}
