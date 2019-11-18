import React, { useState, useContext, useEffect } from 'react';
import { Context as GatewayContext } from 'contexts/gateway'
import { Context as HttpContext } from 'contexts/http'
import {
  NamespaceInfo,
  NamespaceId,
} from "nem2-sdk";
import { useNamespaceData, INamespaceData } from 'hooks';
import { TextOutput } from 'components';
import { convertUInt64ToHex } from 'util/convert';

/**
 *
 * ネームスペース情報取得
 * ネームスペース検索
 */

function convertToNsUInt64(value: string) {
  // namespace name
  // hex id
  // uint64 array
  // uint64 string
}

function stringifyNamespaceData(data: INamespaceData) {
  const {
    namespaceInfo: ni,
    metadata: md
  } = data
  return `Meta:
  active: ${ni.active}
  index: ${ni.index}
  id: ${ni.id.toHex()}
Info:
  ${ni.depth}
  ${ni.levels[0]}
  ${ni.alias.type}
  ${ni.alias.address}
  ${ni.owner.publicKey}
  ${ni.owner.address.plain()}
  ${ni.isRoot}
  ${ni.isSubnamespace}
  startHeight: ${ni.startHeight.toString()}
  endHeight: ${ni.endHeight.toString()}
`
}

function valueToHex(value: string) {
  if(/[0-9a-fA-F]{16}/.test(value)) {
    return value
  }
  try {
    return new NamespaceId(value).toHex()
  } catch(error) {
  }
  try {
    const hex = convertUInt64ToHex(value)
    return NamespaceId.createFromEncoded(hex || value).toHex()
  } catch(error) {
    console.error(error)
    return ""
  }
}

export const Namespace: React.FC = () => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)

  const {namespaceHttp, metadataHttp} = httpContext.httpInstance
  const {namespaceData, setIdentifier, loading, error} = useNamespaceData({
    namespaceHttp,
    metadataHttp
  })

  const [value, setValue] = useState("")
  const [output, setOutput] = useState("")

  function submit() {
    setIdentifier(value)
  }

  useEffect(() => {
    if(! namespaceData) return
    setOutput(stringifyNamespaceData(namespaceData))
  }, [namespaceData])

  return (
<div>
  <fieldset>
    <legend>Input</legend>
    <div className="input-group vertical">
      <label>Namespace</label>
      <input type="text"
        autoFocus
        value={value}
        onChange={(_) => setValue(_.currentTarget.value)}
        onKeyPress={(_) => _.key === "Enter" && submit()}
        placeholder="ex) nem, [HEX], [Lower,Higher]"
        maxLength={64}
      />
      <p className="note"><small>Hit ENTER key to load from Gateway.</small></p>
    </div>
    <p>
    { value
      ? <a href={`${gwContext.url}/namespace/${valueToHex(value)}`}
          target="_blank" rel="noopener noreferrer"
        >{`${gwContext.url}/namespace/${valueToHex(value)}`}</a>
      : <span>{`${gwContext.url}/namespace/`}</span>
    }
    </p>
  </fieldset>

  <TextOutput
    label="Namespace Data"
    value={output}
    loading={loading}
    error={error}
  ></TextOutput>
</div>
  );
}

export default Namespace;
