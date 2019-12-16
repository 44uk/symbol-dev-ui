import { Listener, BlockInfo } from "nem2-sdk"
import { useState, useEffect, useCallback } from "react"
import { Subscription } from "rxjs"

export const useBlockInfoListener = (listener: Listener) => {
  const [blockInfo, setBlockInfo] = useState<BlockInfo | null>(null)
  const [following, setFollowing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handler = useCallback(() => {
    if (following === false) {
      listener.isOpen() && listener.close()
      return
    }
    if (listener.isOpen()) return

    let s$: Subscription
    listener.open().then(() => {
      s$ = listener.newBlock()
        .subscribe(
          setBlockInfo,
          (error) => {
            setFollowing(false)
            setError(error)
            setBlockInfo(null)
          },
          () => {
            setError(null)
          }
        )
    })

    return () => {
      if(s$) {
        s$.unsubscribe()
      }
      if(listener.isOpen()) {
        listener.close()
      }
    }
  }, [following, listener])

  useEffect(handler, [following])

  return { blockInfo, setFollowing, handler, following, error }
}
