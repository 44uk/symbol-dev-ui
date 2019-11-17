import React, { useState, useContext, useEffect } from 'react';

import { Context as GatewayContext } from 'contexts/gateway'
import { Context as HttpContext } from 'contexts/http'

import { TextOutput } from 'components';
import { useMosaicData, IMosaicData } from 'hooks';
import { MosaicId } from 'nem2-sdk';

function valueToHex(value: string) {
  if(/[0-9a-fA-F]{16}/.test(value)) {
    return value
  }
  try {
    return new MosaicId(value).toHex()
  } catch(error) {
    return ""
  }
}

function stringifyMosaicData(data: IMosaicData) {
  return `
${data.mosaicInfo.id.toHex()}
`
}

export const Mosaic: React.FC = () => {
  const gwContext = useContext(GatewayContext)
  const httpContext = useContext(HttpContext)

  const {mosaicHttp, metadataHttp} = httpContext.httpInstance
  const {mosaicData, setIdentifier, loading, error} = useMosaicData({
    mosaicHttp,
    metadataHttp
  })

  const [value, setValue] = useState("")
  const [output, setOutput] = useState("")

  function submit() {
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
        placeholder="ex) nem.xem, [HEX], [Lower,Higher]"
        maxLength={64}
      />
      <p className="note"><small>Hit ENTER key to load from Gateway.</small></p>
    </div>
    <p>
    { value
      ? <a href={`${gwContext.url}/mosaic/${valueToHex(value)}`}
          target="_blank" rel="noopener noreferrer"
        >{`${gwContext.url}/mosaic/${valueToHex(value)}`}</a>
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
  );
}

export default Mosaic;
