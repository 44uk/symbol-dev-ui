import React, { useState, useEffect, useContext, useCallback } from "react"
import YAML from "yaml"
import {
  UInt64,
  ChainHttp,
} from "nem2-sdk"

import {
  GatewayContext,
  HttpContext,
  WebSockContext
} from "contexts"

import {
  useBlockData,
  IBlockData,
  useBlockInfoListener
} from "hooks"

import { TextOutput } from "components"

function stringifyBlockData(data: IBlockData) {
  return YAML.stringify(data)
}

interface IProps {
  query: {
    height?: string
  }
}

export const Block: React.FC<IProps> = ({ query }) => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)
  const webSockContext = useContext(WebSockContext)

  const [prependLoading, setPrependLoading] = useState(false)

  const { blockHttp, receiptHttp } = httpContext.httpInstance
  const { blockData, height, setHeight, handler, loading, error } = useBlockData({
    blockHttp,
    receiptHttp
  }, query.height || "")
  const { listener } = webSockContext.webSockInstance
  const blockListener = useBlockInfoListener(listener)

  const [output, setOutput] = useState("")

  const fetch = useCallback(async () => {
    let _height: UInt64
    if(height) {
      _height = UInt64.fromNumericString(height)
    } else {
      const chainHttp = new ChainHttp(gwContext.url)
      _height = await chainHttp.getBlockchainHeight().toPromise()
    }
    setHeight(_height.toString())
    handler()
  }, [height, setHeight, handler, gwContext.url])

  useEffect(() => {
    if(blockData) setOutput(stringifyBlockData(blockData))
  }, [blockData])

  useEffect(() => {
    const blockInfo = blockListener.blockInfo
    if(blockInfo) setHeight(blockInfo.height.toString())
  }, [blockListener.blockInfo, setHeight])

  return (
<div>
  <fieldset>
    <legend>Block</legend>
    <div className="input-group vertical">
      <label htmlFor="blockHeight">Block Height</label>
      <input type="number"
        autoFocus
        value={height}
        onChange={_ => setHeight(_.target.value)}
        onKeyPress={_ => _.key === "Enter" && fetch()}
        min={1} pattern="[1-9][0-9]*"
        disabled={blockListener.following}
      ></input>
      <p className="note"><small>Hit ENTER key to load from Gateway.</small></p>
      { blockListener.following
        ? <button className="secondary"
            onClick={() => {setPrependLoading(false); fetch(); blockListener.setFollowing(false)}}
          >Stop</button>
        : <button className="primary"
            onClick={() => {setPrependLoading(true); fetch(); blockListener.setFollowing(true)}}
          >Follow</button>
      }
      <p>
      { height
        ? <a href={`${gwContext.url}/block/${height}`}
            target="_blank" rel="noopener noreferrer"
          >{`${gwContext.url}/block/${height}`}</a>
        : <span>{`${gwContext.url}/block/`}</span>
      }
      </p>
    </div>
  </fieldset>

  <TextOutput
    label="Block Data"
    value={output}
    loading={prependLoading ? false : loading}
    error={error}
  ></TextOutput>
</div>
  )
}

export default Block
