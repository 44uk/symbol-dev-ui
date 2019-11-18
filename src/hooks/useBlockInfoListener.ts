import { Listener, BlockInfo } from "nem2-sdk"
import { useState, useEffect } from "react"
import { Subscription } from "rxjs"

export const useBlockInfoListener = (listener: Listener) => {
  const [blockInfo, setBlockInfo] = useState<BlockInfo | null>(null)
  const [following, setFollowing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (following === false) {
      listener.isOpen() && listener.close()
      return
    }

    let subscription: Subscription
    listener.open().then(() => {
      subscription = listener.newBlock()
        .subscribe(
          resp => setBlockInfo(resp),
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
      subscription && subscription.unsubscribe()
      listener.isOpen() && listener.close()
    }
  }, [following, listener])

  return {blockInfo, setFollowing, following, error}
}
