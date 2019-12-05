import React, { useState, useContext, useEffect } from "react"
import YAML from "yaml"
import createPersistedState from "@plq/use-persisted-state"
import {
  GatewayContext,
  HttpContext
} from "contexts"

import { useNamespaceData, INamespaceData } from "hooks"
import { TextOutput } from "components"
import { convertIdentifierToNamespaceHex } from "util/convert"
import { persistedPaths } from "persisted-paths"

const [useInputState] = createPersistedState(persistedPaths.app)

function stringifyNamespaceData(data: INamespaceData) {
  return YAML.stringify(data)
//   const info = (
// `Meta:
//   active: ${ni.active}
//   index: ${ni.index}
//   id: ${ni.id.toHex()}
// Info:
//   Depth: ${ni.depth}
//   Type: ${ni.isRoot ? "root" : "sub"}
//   Levels:
//     ${ni.levels[0]}
//   Alias
//     Type: ${ni.alias.type}
//     Mosaic: ${ni.alias.mosaicId}
//     Address: ${ni.alias.address}
//   Owner:
//     publicKey: ${ni.owner.publicKey}
//     address: ${ni.owner.address.plain()}
//   startHeight: ${ni.startHeight.toString()}
//   endHeight: ${ni.endHeight.toString()}
// `)
//
//   let mosaicInfo = ""
//   if(mId) {
//     mosaicInfo = `MosaicId:
//   ${mId.toHex()}
// `
//   }
//
//   let address = ""
//   if(addr) {
//     address = `Address:
// ${addr.pretty()}
// `
//   }
//
//   return `
//   ${info}
//   ${mosaicInfo}
//   ${address}
//   `
}

interface IProps {
  query: {
    identifier?: string
  }
}

export const Namespace: React.FC<IProps> = ({ query }) => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)

  const [value, setValue] = useInputState(persistedPaths.namespace, query.identifier || "")

  const { namespaceHttp, metadataHttp } = httpContext.httpInstance
  const { namespaceData, identifier, setIdentifier, handler, loading, error} = useNamespaceData({
    namespaceHttp,
    metadataHttp
  }, query.identifier || value)

  const [output, setOutput] = useState("")

  function submit() {
    identifier === value ?
      handler() :
      setIdentifier(value)
  }

  useEffect(() => {
    if(namespaceData) setOutput(stringifyNamespaceData(namespaceData))
  }, [namespaceData])

  useEffect(() => {
    if(identifier) setValue(identifier)
  }, [identifier])

  return (
<div>
  <fieldset>
    <legend>Input</legend>
    <div className="input-group vertical">
      <label>Namespace</label>
      <input type="text"
        autoFocus
        value={value}
        onChange={_ => setValue(_.currentTarget.value)}
        onKeyPress={_ => _.key === "Enter" && submit()}
        placeholder="ex) nem, [HEX], [Lower,Higher]"
        maxLength={64}
      />
      <p className="note"><small>Hit ENTER key to load from Gateway.</small></p>
    </div>
    <p>
    { value
      ? <a href={`${gwContext.url}/namespace/${convertIdentifierToNamespaceHex(value)}`}
          target="_blank" rel="noopener noreferrer"
        >{`${gwContext.url}/namespace/${convertIdentifierToNamespaceHex(value)}`}</a>
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
