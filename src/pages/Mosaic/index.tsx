import React, { useState, useContext, useEffect } from "react"
import YAML from "yaml"

import {
  GatewayContext,
  HttpContext
} from "contexts"

import { TextOutput } from "components"
import { useMosaicData, IMosaicData } from "hooks"
import { convertIdentifierToMosaicHex } from "util/convert"

function stringifyMosaicData(data: IMosaicData) {
  return YAML.stringify(data)
//   const { mosaicInfo, metadata } = data
//   return `
// ${mosaicInfo.id.toHex()}
// ${mosaicInfo.height}
// ${mosaicInfo.divisibility}
// ${mosaicInfo.duration}
// ${mosaicInfo.flags.restrictable}
// ${mosaicInfo.flags.supplyMutable}
// ${mosaicInfo.flags.transferable}
// ${mosaicInfo.isRestrictable()}
// ${mosaicInfo.isSupplyMutable()}
// ${mosaicInfo.isTransferable()}
// ${mosaicInfo.owner.publicKey}
// ${mosaicInfo.owner.address.pretty()}
// ${mosaicInfo.revision}
// ${mosaicInfo.supply}
// `
}

export const Mosaic: React.FC = () => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)

  const { mosaicHttp, metadataHttp, restrictionMosaicHttp } = httpContext.httpInstance
  const { mosaicData, identifier, setIdentifier, handler, loading, error } = useMosaicData({
    mosaicHttp,
    metadataHttp,
    restrictionMosaicHttp
  })

  const [value, setValue] = useState("")
  const [output, setOutput] = useState("")

  function submit() {
    identifier === value ?
      handler() :
      setIdentifier(value)
  }

  useEffect(() => {
    if(! mosaicData) return
    setOutput(stringifyMosaicData(mosaicData))
  }, [mosaicData])

  return (
<div>
  <fieldset>
    <legend>Input</legend>
    <div className="input-group vertical">
      <label>Mosaic</label>
      <input type="text"
        autoFocus
        value={value}
        onChange={(_) => setValue(_.currentTarget.value)}
        onKeyPress={(_) => _.key === "Enter" && submit()}
        placeholder="ex) [HEX], [Lower,Higher]"
        maxLength={64}
      />
      <p className="note"><small>Hit ENTER key to load from Gateway.</small></p>
    </div>
    <p>
    { value
      ? <a href={`${gwContext.url}/mosaic/${convertIdentifierToMosaicHex(value)}`}
          target="_blank" rel="noopener noreferrer"
        >{`${gwContext.url}/mosaic/${convertIdentifierToMosaicHex(value)}`}</a>
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
