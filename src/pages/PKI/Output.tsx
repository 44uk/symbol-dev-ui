import React, { useState, useEffect, useContext } from 'react';
import YAML from 'yaml'

import {
  Account, NetworkType,
} from 'nem2-sdk'

import { Context as GatewayContext } from "contexts/gateway"

import FieldWithLabel from 'components/FieldWithLabel'

interface IProps {
  account: Account | null
  pretty: boolean
}

function toJson(account: Account, url: string, pretty = false) {
  const obj = {
    privateKey: account.privateKey,
    publicKey: account.publicKey,
    address: account.address[pretty ? 'pretty' : 'plain'](),
    networkType: account.networkType,
    url: url,
    networkGenerationHash: '--WIP--',
  };
  return JSON.stringify(obj, null, 4);
}

function toText(account: Account, url: string, pretty = false) {
  return `privateKey: ${account.privateKey}
publicKey: ${account.publicKey}
address: ${account.address[pretty ? 'pretty' : 'plain']()}
networkType: ${account.networkType}
url: ${url}
networkGenerationHash: --WIP--`;
}

function copyToClipboard(text: string) {
  if(text.length === 0) { return }
  navigator
    .clipboard
    .writeText(text)
    .then(() => {
      console.log(`Copied to clipBoard!`)
      console.log(text)
    })
    .catch((error) => console.error("Your browser doesn't support copy to clipboard"))
  ;
}

export const Output: React.FC<IProps> = ({
  account,
  pretty
}) => {
  const gwContext = useContext(GatewayContext)

  const {
    publicKey,
    address,
    hexAddress,
    networkType,
    networkName
  } = {
    publicKey: account ?
      account.publicKey :
      "",
    address: account ?
      account.address[pretty ? 'pretty' : 'plain']() :
      "",
    hexAddress: account ?
      account.address.encoded() :
      "",
    networkType: account ?
      account.networkType.toString() :
      "",
    networkName: account ?
      NetworkType[account.networkType].toString() :
      "",
  }

  const [format, setFormat] = useState<'json' | 'text'>('json')
  const [output, setOutput] = useState("")

  useEffect(() => {
    if(!account) { return }
    let text;
    switch (format) {
      case 'json':
        text = toJson(account, gwContext.url, pretty);
        break;
      case 'text':
        text = toText(account, gwContext.url, pretty);
        break;
      default:
        text = ""
        break;
    }
    setOutput(text)
  }, [format, account, pretty])

  return (
    <fieldset>
      <legend>Output</legend>
      <div>
        <FieldWithLabel readonly={true} label="PublicKey" value={publicKey} />
        <FieldWithLabel readonly={true} label="Address" value={address} />
        <FieldWithLabel readonly={true} label="HexAddress" value={hexAddress} />
        <FieldWithLabel readonly={true} label="NetworkType(UInt)" value={networkType} />
        <FieldWithLabel readonly={true} label="NetworkType(Name)" value={networkName} />
      </div>

      <div>
        <div className="input-group vertical">
          <div>
            <input type="radio" id="json"
              onChange={() => setFormat('json')}
              checked={format === 'json'}
            /><label htmlFor="json">toJSON</label>
            <input type="radio" id="text"
              onChange={() => setFormat('text')}
              checked={format === 'text'}
            /><label htmlFor="text">toText</label>
          </div>
          <textarea readOnly={true} rows={8} value={output}></textarea>
          <button className="button tertiary"
            onClick={() => copyToClipboard(output)}>Copy it!</button>
        </div>
      </div>
    </fieldset>
  );
}
export default Output;
