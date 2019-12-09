import React, { useState, useContext, useEffect, useCallback, ChangeEvent } from "react"
import YAML from "yaml"

import {
  GatewayContext,
  HttpContext
} from "contexts"

import { useMosaicData, IMosaicData } from "hooks"
import { TextOutput } from "components"
import { convertIdentifierToMosaicHex } from "util/convert"

function stringifyMosaicData(data: IMosaicData) {
  return YAML.stringify(data)
}

interface IProps {
  query: {
    identifier?: string
  }
}

export const Mosaic: React.FC<IProps> = ({ query }) => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)

  const { mosaicHttp, namespaceHttp, metadataHttp, restrictionMosaicHttp } = httpContext.httpInstance
  const { mosaicData, identifier, setIdentifier, handler, loading, error } = useMosaicData({
    mosaicHttp,
    namespaceHttp,
    metadataHttp,
    restrictionMosaicHttp
  }, query.identifier || "")

  const [output, setOutput] = useState("")

  const submit = useCallback(() => {
    handler()
  }, [handler])

  const onChangeInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setIdentifier(event.currentTarget.value)
  }, [setIdentifier])

  useEffect(() => {
    if(mosaicData) setOutput(stringifyMosaicData(mosaicData))
  }, [mosaicData])

  return (
<div>
  <fieldset>
    <legend>Input</legend>
    <div className="input-group vertical">
      <label>Mosaic</label>
      <input type="text"
        autoFocus
        value={identifier}
        onChange={onChangeInput}
        onKeyPress={_ => _.key === "Enter" && submit()}
        placeholder="ex) [HEX], [Lower,Higher]"
        maxLength={64}
      />
      <p className="note"><small>Hit ENTER key to load from Gateway.</small></p>
    </div>
    <p>
    { convertIdentifierToMosaicHex(identifier)
      ? <a href={`${gwContext.url}/mosaic/${convertIdentifierToMosaicHex(identifier)}`}
          target="_blank" rel="noopener noreferrer"
        >{`${gwContext.url}/mosaic/${convertIdentifierToMosaicHex(identifier)}`}</a>
      : <span>{`${gwContext.url}/mosaic/`}</span>
    }
    </p>
  </fieldset>

  <TextOutput
    label="Mosaic Data"
    value={output}
    loading={loading}
    error={error}
  ></TextOutput>
</div>
  )
}

export default Mosaic
