import React, { useContext, useState, useEffect } from "react"

import TextOutput from "components/TextOutput"

import {
  GatewayContext
} from "contexts"

import { useMultisigData, IMultisigData } from "hooks"

import  { graph2tree }from "util/graph2tree"

function stringifyMultisigData(data: IMultisigData, truncated = true) {
  const opts = { truncated }
  return graph2tree(data.graphInfo, opts)
}

export const MLMS: React.FC = () => {
  const gwContext = useContext(GatewayContext)

  const { multisigData, identifier, setIdentifier, handler, loading, error } = useMultisigData(gwContext.url)

  const [value, setValue] = useState("")
  const _value = value.replace(/-/g, "")

  const [truncated, setTruncated] = useState(true)
  const [output, setOutput] = useState("")

  function submit() {
    identifier === value ?
      handler() :
      setIdentifier(value)
  }

  useEffect(() => {
    if(! multisigData) return
    setOutput(stringifyMultisigData(multisigData, truncated))
  }, [multisigData, truncated])

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
        onChange={_ => setValue(_.currentTarget.value)}
        onKeyPress={_ => _.key === "Enter" && submit()}
        placeholder="ex) Address or PublicKey"
        maxLength={64}
      />
      <p className="note"><small>Hit ENTER key to load from Node.</small></p>
    </div>
    <div className="input-group">
      <input type="checkbox" id="truncated"
        onChange={() => setTruncated(!truncated)}
        checked={truncated}
      />
      <label htmlFor="truncated">Truncated&nbsp;<small>PublicKey is showed truncated.</small></label>
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
  >
    <p className="note"><small>Symbols mean -> "#" Root, "└" CoSigner, "&lt;&lt;" Referer, "(C: Cosigners, A: minApproval, R: minRemovable)"</small></p>
  </TextOutput>
</div>
  )
}

export default MLMS
