import React, { useState, useEffect, useCallback } from "react"
import YAML from "yaml"

import { TextOutput } from "components"
import { usePayloadData } from "hooks"

export const Payload: React.FC = () => {
  const { transaction, payload, setPayload, error } = usePayloadData("")

  const [output, setOutput] = useState("")

  const submit = useCallback((input: string) => {
    setPayload(input.trim())
  }, [setPayload])

  useEffect(() => {
    if(transaction) setOutput(YAML.stringify(transaction))
  }, [transaction])

  return (
<div>
  <fieldset>
    <legend>Input</legend>
    <div className="input-group vertical">
      <label>Transaction</label>
      <textarea
        autoFocus
        value={payload}
        onChange={_ => submit(_.currentTarget.value)}
        placeholder="ex) Transaction Payload"
        rows={4}
      ></textarea>
    </div>
  </fieldset>

  <TextOutput
    label="Transaction"
    value={output}
    error={error}
  ></TextOutput>
</div>
  )
}

export default Payload
