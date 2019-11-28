import { useState, useEffect } from "react"
import { NodeHttp, NodeInfo, NodeTime, DiagnosticHttp, ServerInfo, BlockchainStorageInfo } from "nem2-sdk"
import { forkJoin } from "rxjs"
import { map } from "rxjs/operators"

export interface INodeData {
  nodeInfo: NodeInfo
  nodeTime: NodeTime
  serverInfo: ServerInfo
  storage: BlockchainStorageInfo
}

interface IHttpInstance {
  nodeHttp: NodeHttp
  diagnosticHttp: DiagnosticHttp
}

export const useNodeData = (httpInstance: IHttpInstance) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [nodeData, setNodeData] = useState<INodeData | null>(null)

  const { nodeHttp, diagnosticHttp } = httpInstance

  const handler = () => {
    setLoading(true)
    forkJoin([
      nodeHttp.getNodeInfo(),
      nodeHttp.getNodeTime(),
      diagnosticHttp.getServerInfo(),
      diagnosticHttp.getDiagnosticStorage(),
    ])
      .pipe(
        map(resp => ({
          nodeInfo: resp[0],
          nodeTime: resp[1],
          serverInfo: resp[2],
          storage: resp[3],
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
  }

  useEffect(handler, [nodeHttp])

  return { nodeData, handler, loading, error }
}
