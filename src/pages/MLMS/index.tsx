import React, { useContext, useState, useEffect } from "react"

import TextOutput from "components/TextOutput"

import { Context as GatewayContext } from "contexts/gateway"

import { useMultisigData, IMultisigData } from "hooks"

import  { graph2tree }from "util/graph2tree"

function stringifyMultisigData(data: IMultisigData) {
  return graph2tree(data.graphInfo)
}

export const MLMS: React.FC = () => {
  const gwContext = useContext(GatewayContext)

  const { multisigData, identifier, setIdentifier, handler, loading, error } = useMultisigData(gwContext.url)

  const [value, setValue] = useState("")
  const _value = value.replace(/-/g, "")

  const [output, setOutput] = useState("")

  function submit() {
    identifier === value ?
      handler() :
      setIdentifier(value)
  }

  useEffect(() => {
    console.log("HOGE: %o", multisigData)
    if(! multisigData) return
    setOutput(stringifyMultisigData(multisigData))
  }, [multisigData])

  return (
<div>
  <fieldset>
    <legend>Input</legend>
    <div className="input-group vertical">
      <label>Address/PublicKey</label>
      <input type="text" name="addressOrPublicKey"
        autoFocus
        pattern="[a-fA-F\d-]+"
        value={value}
        onChange={(_) => setValue(_.currentTarget.value)}
        onKeyPress={(_) => _.key === "Enter" && submit()}
        placeholder="ex) Address or PublicKey"
        maxLength={64}
      />
      <p className="note"><small>Hit ENTER key to load from Node.</small></p>
    </div>
    <p>
    { value
      ? <a href={`${gwContext.url}/account/${_value}/multisig/graph`}
          target="_blank" rel="noopener noreferrer"
        >{`${gwContext.url}/account/${_value}/multisig/graph`}</a>
      : <span>{`${gwContext.url}/account/{AddressOrPublicKey}/multisig/graph`}</span>
    }
    </p>
  </fieldset>

  <TextOutput
    label="Multisig Data"
    value={output}
    loading={loading}
    error={error}
  ></TextOutput>
</div>
  )
}

export default MLMS
