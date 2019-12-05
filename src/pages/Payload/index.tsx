import React, { useState, useEffect } from "react"
import YAML from "yaml"
import createPersistedState from "@plq/use-persisted-state"

import { TextOutput } from "components"
import { usePayloadData } from "hooks"

import { persistedPaths } from "persisted-paths"

const [useInputState] = createPersistedState(persistedPaths.app)

export const Payload: React.FC = () => {
  const [value, setValue] = useInputState(persistedPaths.payload, "")

  const { transaction, setPayload, error } = usePayloadData("")

  const [output, setOutput] = useState("")

  function submit(input: string) {
    setValue(input.trim())
  }

  useEffect(() => {
    if(transaction) setOutput(YAML.stringify(transaction))
  }, [transaction])

  useEffect(() => {
    setPayload(value)
  }, [value, setPayload])

  return (
<div>
  <fieldset>
    <legend>Input</legend>
    <div className="input-group vertical">
      <label>Transaction</label>
      <textarea
        autoFocus
        value={value}
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
