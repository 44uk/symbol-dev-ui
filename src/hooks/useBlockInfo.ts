import { useState, useEffect } from "react"
import { BlockHttp, BlockInfo } from "nem2-sdk"

export const useBlockInfo = (http: BlockHttp) => {
  const [blockInfo, setBlockInfo] = useState<BlockInfo | null>(null)
  const [height, setHeight] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if(! height) return
    setLoading(true)

    http.getBlockByHeight(height)
      .subscribe(
        resp =>  setBlockInfo(resp),
        (error) => {
          setLoading(false)
          setError(error)
          setBlockInfo(null)
        },
        () => setLoading(false)
      )
  }, [height])

  return {block: blockInfo, setHeight, loading, error}
}
