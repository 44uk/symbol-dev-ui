import React, { useContext, useState, useEffect } from 'react';

import { Context as GatewayContext } from 'contexts/gateway'
import { Context as HttpContext } from 'contexts/http'

import { INodeData, useNodeData } from 'hooks/useNodeData'

import { TextOutput } from 'components/TextOutput'

function stringifyNodeData(nd: INodeData) {
  return `NodeInfo:
  host: ${nd.nodeInfo.host}
  friendlyName: ${nd.nodeInfo.friendlyName}
NodeTime:
  receive: ${nd.nodeTime.receiveTimeStamp}
  send: ${nd.nodeTime.sendTimeStamp}
`
}

export const Node: React.FC = () => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)

  const { nodeHttp } = httpContext.httpInstance
  const {nodeData, loading, error} = useNodeData({ nodeHttp })

  const [output, setOutput] = useState("")

  useEffect(() => {
    if(! nodeData) { return }
    setOutput(stringifyNodeData(nodeData))
  }, [nodeData])

  return (
<div>
  <fieldset>
    <legend>Node</legend>
    <div className="input-group vertical">
      <p>
      { true
        ? <a href={`${gwContext.url}/node/info`}
            target="_blank" rel="noopener noreferrer"
          >{`${gwContext.url}/node/info`}</a>
        : <span>{`${gwContext.url}/block/`}</span>
      }
      </p>
    </div>
  </fieldset>

  <TextOutput
    label="Node Data"
    value={output}
    loading={loading}
    error={error}
  ></TextOutput>
</div>
  );
}

export default Node;
