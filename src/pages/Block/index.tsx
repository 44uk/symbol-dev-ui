import React, { useState, useEffect, useContext } from 'react';
import {
  UInt64,
  BlockInfo,
  ChainHttp,
  Listener
} from 'nem2-sdk';

import { Context as GatewayContext } from 'contexts/gateway'
import { Context as HttpContext } from 'contexts/http'

import { useBlockData } from 'hooks/useBlockData'
import { useBlockListener } from 'hooks/useBlockInfoListener'
import { TextOutput } from 'components/TextOutput'

function stringifyBlockInfo(bi: BlockInfo) {
  return `meta:
  hash: ${bi.hash}
  totalFee: ${bi.totalFee.toString()}
  generationHash: ${bi.generationHash}
  stateHashSubCacheMerkleRoots:
    -
  numTransactions: ${bi.numTransactions}
  numStatements:
block:
  signature: ${bi.signature}
  signerPublicKey: ${bi.signer.publicKey}
  version: ${bi.version}
  type: ${bi.type}
  height: ${bi.height}
  timestamp: ${bi.timestamp}
  difficulty: ${bi.difficulty}
  feeMultiplier: ${bi.feeMultiplier.toString()}
  previousBlockHash: ${bi.previousBlockHash}
  transactionsHash:
  receiptsHash:
  stateHash: ${bi.stateHash}
  beneficiaryPublicKey: ${bi.beneficiaryPublicKey}
`
}

//const networkType = parseInt(blockDTO.block.version.toString(16).substr(0, 2), 16);
//return new BlockInfo_1.BlockInfo(blockDTO.meta.hash, blockDTO.meta.generationHash, UInt64_1.UInt64.fromNumericString(blockDTO.meta.totalFee), blockDTO.meta.numTransactions, blockDTO.block.signature, PublicAccount_1.PublicAccount.createFromPublicKey(blockDTO.block.signerPublicKey, networkType), networkType, parseInt(blockDTO.block.version.toString(16).substr(2, 2), 16), // Tx version

export const Block: React.FC = () => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)

  const { blockHttp, metadataHttp } = httpContext.httpInstance
  const {blockData, setHeight, loading, error} = useBlockData({ blockHttp, metadataHttp })

  const listener = new Listener(gwContext.url.replace(/^http/, "ws"), WebSocket)
  const blockListener = useBlockListener(listener)

  const [blockHeight, setBlockHeight] = useState("")
  const [output, setOutput] = useState("")

  useEffect(() => {
    let _block = blockListener.following ?
      blockListener.block :
      blockData && blockData.blockInfo
    if(_block ) {
      setBlockHeight(_block.height.toString())
      setOutput(stringifyBlockInfo(_block))
    }
  }, [blockData, blockListener.block])

  const fetchBlockInfo = async () => {
    let height: UInt64
    if(blockHeight.length === 0) {
      const chainHttp = new ChainHttp(gwContext.url)
      height = await chainHttp.getBlockchainHeight().toPromise()
      setBlockHeight(height.toString())
    } else {
      height = UInt64.fromNumericString(blockHeight)
    }
    setHeight(height.compact())
  }

  return (
<div>
  <fieldset>
    <legend>Block</legend>
    <div className="input-group vertical">
      <label htmlFor="blockHeight">Block Height</label>
      <input type="number" autoFocus
        disabled={blockListener.following}
        min={1} pattern="[0-9]*"
        value={blockHeight}
        onChange={(_) => setBlockHeight(_.target.value)}
      ></input>
      <button className="primary"
        disabled={blockListener.following}
        onClick={() => fetchBlockInfo()}
      >Fetch</button>
      { blockListener.following
        ? <button className="secondary" onClick={() => blockListener.setFollowing(false)} >Stop</button>
        : <button className="primary" onClick={() => blockListener.setFollowing(true)} >Follow</button>
      }
      <p>
      { blockHeight
        ? <a href={`${gwContext.url}/block/${blockHeight}`}
            target="_blank" rel="noopener noreferrer"
          >{`${gwContext.url}/block/${blockHeight}`}</a>
        : <span>{`${gwContext.url}/block/`}</span>
      }
      </p>
    </div>
  </fieldset>

  <TextOutput
    label="Block Info"
    value={output}
    loading={loading}
    error={error}
  ></TextOutput>
</div>
  );
}

export default Block;
