import React, { useState, useEffect, useContext } from "react"
import YAML from "yaml"
import createPersistedState from "@plq/use-persisted-state"
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
import { persistedPaths } from "persisted-paths"

const [useInputState] = createPersistedState(persistedPaths.app)

function stringifyBlockData(data: IBlockData) {
  return YAML.stringify(data)
//   return `meta:
//   hash: ${bi.hash}
//   totalFee: ${bi.totalFee.toString()}
//   generationHash: ${bi.generationHash}
//   stateHashSubCacheMerkleRoots:
//     -
//   numTransactions: ${bi.numTransactions}
//   numStatements:
// block:
//   signature: ${bi.signature}
//   signerPublicKey: ${bi.signer.publicKey}
//   version: ${bi.version}
//   type: ${bi.type}
//   height: ${bi.height}
//   timestamp: ${bi.timestamp}
//   difficulty: ${bi.difficulty}
//   feeMultiplier: ${bi.feeMultiplier.toString()}
//   previousBlockHash: ${bi.previousBlockHash}
//   transactionsHash:
//   receiptsHash:
//   stateHash: ${bi.stateHash}
//   beneficiaryPublicKey: ${bi.beneficiaryPublicKey}
// `
}

//const networkType = parseInt(blockDTO.block.version.toString(16).substr(0, 2), 16)
//return new BlockInfo_1.BlockInfo(blockDTO.meta.hash, blockDTO.meta.generationHash, UInt64_1.UInt64.fromNumericString(blockDTO.meta.totalFee), blockDTO.meta.numTransactions, blockDTO.block.signature, PublicAccount_1.PublicAccount.createFromPublicKey(blockDTO.block.signerPublicKey, networkType), networkType, parseInt(blockDTO.block.version.toString(16).substr(2, 2), 16), // Tx version

interface IProps {
  query: {
    height?: string
  }
}

export const Block: React.FC<IProps> = ({ query }) => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)
  const webSockContext = useContext(WebSockContext)

  const [value, setValue] = useInputState(persistedPaths.block, query.height || "")

  const { blockHttp, receiptHttp } = httpContext.httpInstance
  const { blockData, height, setHeight, loading, error } = useBlockData({
    blockHttp,
    receiptHttp
  }, query.height || value)
  const { listener } = webSockContext.webSockInstance
  const blockListener = useBlockInfoListener(listener)

  const [output, setOutput] = useState("")
  const [prependLoading, setPrependLoading] = useState(false)

  const fetch = async () => {
    let height: UInt64
    if(value) {
      height = UInt64.fromNumericString(value)
    } else {
      const chainHttp = new ChainHttp(gwContext.url)
      height = await chainHttp.getBlockchainHeight().toPromise()
      setValue(height.toString())
    }
    setHeight(height.toString())
  }

  useEffect(() => {
    if(blockData) setOutput(stringifyBlockData(blockData))
  }, [blockData])

  useEffect(() => {
    if(height) setValue(height)
  }, [height])

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
        value={value}
        onChange={_ => setValue(_.target.value)}
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
      { value
        ? <a href={`${gwContext.url}/block/${value}`}
            target="_blank" rel="noopener noreferrer"
          >{`${gwContext.url}/block/${value}`}</a>
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
