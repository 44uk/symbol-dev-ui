import { useState, useEffect } from "react"
import { NodeHttp, NodeInfo, NodeTime } from "nem2-sdk"
import { forkJoin } from "rxjs"
import { map } from "rxjs/operators"

export interface INodeData {
  nodeInfo: NodeInfo
  nodeTime: NodeTime
}

interface IHttpInstance {
  nodeHttp: NodeHttp
}

export const useNodeData = (httpInstance: IHttpInstance) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [nodeData, setNodeData] = useState<INodeData | null>(null)

  const { nodeHttp } = httpInstance

  useEffect(() => {
    setLoading(true)
    forkJoin([
      nodeHttp.getNodeInfo(),
      nodeHttp.getNodeTime()
    ])
      .pipe(
        map(resp => ({
          nodeInfo: resp[0],
          nodeTime: resp[1],
        }))
      )
      .subscribe(
        data =>  setNodeData(data),
        (error) => {
          setLoading(false)
          setError(error)
          setNodeData(null)
        },
        () => {
          setLoading(false)
          setError(null)
        }
      )
  }, [nodeHttp])

  return {nodeData, loading, error}
}
