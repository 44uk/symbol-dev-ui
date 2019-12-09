import React, { useContext, useState, useEffect, useCallback } from "react"

import {
  GatewayContext
} from "contexts"

import { useMultisigData, IMultisigData } from "hooks"
import { TextOutput } from "components"
import { graph2tree }from "util/graph2tree"

function stringifyMultisigData(data: IMultisigData, truncated = true) {
  const opts = { truncated }
  return graph2tree(data.graphInfo, opts)
}

interface IProps {
  query: {
    identifier?: string
  }
}

export const MLMS: React.FC<IProps> = ({ query }) => {
  const gwContext = useContext(GatewayContext)

  const [truncated, setTruncated] = useState(true)

  const { multisigData, identifier, setIdentifier, handler, loading, error } = useMultisigData(
    gwContext.url,
    query.identifier || ""
  )

  const [output, setOutput] = useState("")

  const submit = useCallback(() => {
    handler()
  }, [handler])

  useEffect(() => {
    if(multisigData) setOutput(stringifyMultisigData(multisigData, truncated))
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
        value={identifier}
        onChange={_ => setIdentifier(_.currentTarget.value)}
        onKeyPress={_ => _.key === "Enter" && submit()}
        placeholder="ex) Address or PublicKey"
        maxLength={64}
      />
      <p className="note"><small>Hit ENTER key to load from Node.</small></p>
    </div>
    <div className="input-group">
      <label>
        <input type="checkbox"
          onChange={() => setTruncated(!truncated)}
          checked={truncated}
        />
        Truncated&nbsp;<small>PublicKey is showed truncated.</small>
      </label>
    </div>
    <p>
    { identifier
      ? <a href={`${gwContext.url}/account/${identifier.replace(/-/g, "")}/multisig/graph`}
          target="_blank" rel="noopener noreferrer"
        >{`${gwContext.url}/account/${identifier.replace(/-/g, "")}/multisig/graph`}</a>
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
