import { Listener, BlockInfo } from "nem2-sdk"
import { useState, useEffect } from "react"
import { Subscription } from "rxjs"

export const useBlockListener = (listener: Listener) => {
  const [block, setBlock] = useState<BlockInfo | null>(null)
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    if (following === false) {
      listener.isOpen() && listener.close()
      return
    }
    let subscription: Subscription
    listener.open().then(() => {
      subscription = listener.newBlock()
        .subscribe(
          resp => setBlock(resp)
        )
    })

    return () => {
      subscription && subscription.unsubscribe()
      listener.isOpen() && listener.close()
    }
  }, [following, listener])

  return {block, following, setFollowing}
}
