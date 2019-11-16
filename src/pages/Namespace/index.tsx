import React, { useState, useContext, useEffect } from 'react';
import { Context as GatewayContext } from 'contexts/gateway'
import {
  NamespaceHttp,
  NamespaceId,
  NamespaceService,
  NamespaceInfo,
} from "nem2-sdk";
import { useNamespace } from 'hooks';
import { TextOutput } from 'components';

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

function stringifyNamespaceInfo(ni: NamespaceInfo) {
  return `
  ${ni.id}
`
}

export const Namespace: React.FC = () => {
  const gwContext = useContext(GatewayContext)
  const http = new NamespaceHttp(gwContext.url)
  const [output, setOutput] = useState("")
  const [value, setValue] = useState('')
  const {namespaceInfo, setIdentifier, loading, error} = useNamespace(http)

  function submit() {
    setIdentifier(value)
  }

  useEffect(() => {
    if(! namespaceInfo) return
    setOutput(stringifyNamespaceInfo(namespaceInfo))
  }, [namespaceInfo, http])

  return (
<div>
  <fieldset>
    <legend>Input</legend>
    <div className="input-group vertical">
      <label>Namespace</label>
      <input type="text" name=""
        autoFocus
        value={value}
        onChange={(_) => setValue(_.currentTarget.value)}
        onKeyPress={(_) => _.key === "Enter" && submit()}
        placeholder="ex) nem, [HEX], [Lower,Higher]"
        maxLength={64}
      />
      <p className="note"><small>Hit ENTER key to load from Gateway.</small></p>
    </div>
  </fieldset>

  <TextOutput
    label="Namespace Info"
    value={output}
    loading={loading}
    error={error}
  ></TextOutput>
</div>
  );
}

export default Namespace;
