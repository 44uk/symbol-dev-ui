import React, { useState, useContext, useEffect, useCallback, ChangeEvent } from "react"
import YAML from "yaml"

import {
  GatewayContext,
  HttpContext
} from "contexts"

import { useNamespaceData, INamespaceData } from "hooks"
import { TextOutput } from "components"
import { convertIdentifierToNamespaceHex } from "util/convert"

function stringifyNamespaceData(data: INamespaceData) {
  return YAML.stringify(data)
}

interface IProps {
  query: {
    identifier?: string
  }
}

export const Namespace: React.FC<IProps> = ({ query }) => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)

  const { namespaceHttp, metadataHttp } = httpContext.httpInstance
  const { namespaceData, identifier, setIdentifier, handler, loading, error} = useNamespaceData({
    namespaceHttp,
    metadataHttp
  }, query.identifier || "")

  const [output, setOutput] = useState("")

  const submit = useCallback(() => {
    handler()
  }, [handler])

  const onChangeInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setIdentifier(event.currentTarget.value)
  }, [setIdentifier])

  useEffect(() => {
    if(namespaceData) setOutput(stringifyNamespaceData(namespaceData))
  }, [namespaceData])

  return (
<div>
  <fieldset>
    <legend>Input</legend>
    <div className="input-group vertical">
      <label>Namespace</label>
      <input type="text"
        autoFocus
        value={identifier}
        onChange={onChangeInput}
        onKeyPress={_ => _.key === "Enter" && submit()}
        placeholder="ex) nem, [HEX], [Lower,Higher]"
        maxLength={64}
      />
      <p className="note"><small>Hit ENTER key to load from Gateway.</small></p>
    </div>
    <p>
    { convertIdentifierToNamespaceHex(identifier)
      ? <a href={`${gwContext.url}/namespace/${convertIdentifierToNamespaceHex(identifier)}`}
          target="_blank" rel="noopener noreferrer"
        >{`${gwContext.url}/namespace/${convertIdentifierToNamespaceHex(identifier)}`}</a>
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
  )
}

export default Namespace
