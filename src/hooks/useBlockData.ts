import { useState, useEffect } from "react"
import { BlockHttp, BlockInfo, Statement } from "nem2-sdk"
import { map } from "rxjs/operators"
import { forkJoin } from "rxjs"

export interface IBlockData {
  blockInfo: BlockInfo
  receipt: Statement
}

interface IHttpInstance {
  blockHttp: BlockHttp
}

export const useBlockData = (httpInstance: IHttpInstance) => {
  const [height, setHeight] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const [blockData, setBlockData] = useState<IBlockData | null>(null)

  const { blockHttp } = httpInstance

  useEffect(() => {
    if(! height) return

    setLoading(true)
    forkJoin([
      blockHttp.getBlockByHeight(height),
      blockHttp.getBlockReceipts(height)
    ])
      .pipe(
        map(resp => ({
          blockInfo: resp[0],
          receipt: resp[1]
        }))
      )
      .subscribe(
        data =>  setBlockData(data),
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
  }, [height, blockHttp])

  return {blockData, setHeight, loading, error}
}
