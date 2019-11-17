import { useState, useEffect } from "react"
import { BlockHttp, BlockInfo, MetadataHttp, Metadata } from "nem2-sdk"
import { map } from "rxjs/operators"
import { forkJoin } from "rxjs"

export interface IBlockData {
  blockInfo: BlockInfo
  metadata: Metadata[]
}

interface IHttpInstance {
  blockHttp: BlockHttp
  metadataHttp: MetadataHttp
}

export const useBlockData = (httpInstance: IHttpInstance) => {
  const [height, setHeight] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [blockData, setBlockData] = useState<IBlockData | null>(null)

  const { blockHttp } = httpInstance

  useEffect(() => {
    if(! height) return

    setLoading(true)
    forkJoin([
      blockHttp.getBlockByHeight(height)
    ])
      .pipe(
        map(resp => ({
          blockInfo: resp[0],
          metadata: []
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
  }, [height])

  return {blockData, setHeight, loading, error}
}
